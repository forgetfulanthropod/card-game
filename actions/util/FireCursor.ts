import type { firestore } from 'firebase-admin'
import ldGet from 'lodash/get'

// type Objectish = Record<string, unknown>
// type PathsOf<Root, Path extends AllPaths<Root>> = AllPaths<DeepIndex<Root, Path>>
export interface FireCursor<Root, Sub = Root> {
    select<K extends keyof Sub>(k: K): FireCursor<Root, Sub[K]>
    get(): Promise<Sub>
    get<K extends keyof Sub>(k: K): Promise<Sub[K]>
    set(v: Sub): Promise<void>
    set<K extends keyof Sub>(k: K, v: Sub[K]): Promise<void>
    apply(f: (prev: Sub) => Sub): Promise<void>
    apply<K extends keyof Sub>(k: K, f: (prev: Sub[K]) => Sub[K]): Promise<void>
    on(eventName: 'update', cb: (v: Sub) => void): void
}

// Probably should just export makeFireCursor<Root> and make the <Sub> stuff a private function.
/** NOTE: you can only have one makeFireCursor per document */
export function makeFireCursor<Root, Sub = Root>(
    docRef: firestore.DocumentReference<Root>,
    path: string[],
    docRefMemo?: DocRefMemo<Root>): FireCursor<Root, Sub> {
    if (path.length === 0 && docRefMemo == null) {
        if (global.madeCursor) {
            throw Error('already made cursor')
        }
        global.madeCursor = true
        docRefMemo = makeDocRefMemo(docRef)
    }
    return {
        select<K extends keyof Sub>(k): FireCursor<Root, Sub[K]> {
            const newPath = [...path, k as string]
            return makeFireCursor<Root, Sub[K]>(docRef, newPath, docRefMemo)
        },
        async get(k?) {
            const data = await docRefMemo.get()
            const newPath = k == null ? path : [...path, k]
            if (newPath.length === 0) { return data }
            const result = ldGet(data, newPath)
            return result
        },
        // https://stackoverflow.com/a/47296152
        async set(keyOrValue, maybeVal?): Promise<void> {
            docRefMemo.clear()
            if (maybeVal == null) {
                const value = keyOrValue
                if (path.length === 0) {
                    await docRef.update(value)
                    return
                }
                const keyString = path.join('.')
                await docRef.update({ [keyString]: value })
            } else {
                const key = keyOrValue
                const value = maybeVal
                const keyString = [...path, key].join('.')
                await docRef.update({ [keyString]: value })
            }
        },
        // setLater() { },
        // applyLater() { },
        // commit() { },
        async apply(keyOrFunc, maybeFunc?) {
            const data = await docRefMemo.get()
            docRefMemo.clear()
            const [key, func] = maybeFunc == null ?
                [null, keyOrFunc] :
                [keyOrFunc, maybeFunc]
            const newPath = key == null ? path : [...path, key as string]
            const current = ldGet(data, newPath)
            const newVal = func(current)
            const keyString = newPath.join('.')
            await docRef.update({ [keyString]: newVal })
        },
        on(_, cb) {
            docRef.onSnapshot(
                path.length === 0 ?
                    // TODO: explicit cast shouldn't be necessary
                    async _doc => { docRefMemo.clear(); cb(await docRefMemo.get() as unknown as Sub) } :
                    async _doc => { docRefMemo.clear(); cb(ldGet(await docRefMemo.get(), path)) })
        },
    }
}

interface DocRefMemo<T> {
    get(): Promise<T>
    clear(): void
}

function makeDocRefMemo<T>(docRef: firestore.DocumentReference<T>): DocRefMemo<T> {
    let lastValue: T | null = null
    return {
        async get() {
            if (lastValue != null) { return lastValue }
            lastValue = (await docRef.get()).data()
            return lastValue
        },
        clear() {
            lastValue = null
        }
    }
}
