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
    apply(f: (prev: Sub) => Sub): void
    apply<K extends keyof Sub>(k: K, f: (prev: Sub[K]) => Sub[K]): void
    on(eventName: 'update', cb: (v: Sub) => void): void
}

// Probably should just export makeFBCursor<Root> and make the <Sub> stuff a private function.
export function makeFBCursor<Root, Sub = Root>(
    docRef: firestore.DocumentReference<Root>,
    path: string[]): FireCursor<Root, Sub> {
    return {
        select<K extends keyof Sub>(k): FireCursor<Root, Sub[K]> {
            const newPath = [...path, k as string]
            return makeFBCursor<Root, Sub[K]>(docRef, newPath)
        },
        async get(k?) {
            const data = (await docRef.get()).data()
            const newPath = k == null ? path : [...path, k]
            if (newPath.length === 0) { return data }
            const result = ldGet(data, newPath)
            return result
        },
        // https://stackoverflow.com/a/47296152
        async set(keyOrValue, maybeVal?): Promise<void> {
            if (maybeVal == null) {
                const value = keyOrValue
                if (path.length === 0) { await docRef.update(value) }
                const keyString = path.join('.')
                await docRef.update({ [keyString]: value })
            } else {
                const key = keyOrValue
                const value = maybeVal
                const keyString = [...path, key].join('.')
                await docRef.update({ [keyString]: value })
            }
        },
        async apply(keyOrFunc, maybeFunc?) {
            const data = (await docRef.get()).data()
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
                    doc => { cb(doc.data() as unknown as Sub) } :
                    doc => { cb(ldGet(doc.data(), path)) })
        },
    }
}
