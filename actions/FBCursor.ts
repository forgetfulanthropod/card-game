import type { firestore } from 'firebase-admin'
import ldGet from 'lodash/get'

// type Objectish = Record<string, unknown>
// type PathsOf<Root, Path extends AllPaths<Root>> = AllPaths<DeepIndex<Root, Path>>
export interface FBCursor<Root, Sub = Root> {
    select<K extends keyof Sub>(k: K): FBCursor<Root, Sub[K]>
    get(): Promise<Sub>
    get<K extends keyof Sub>(k: K): Promise<Sub[K]>
    set(v: Sub): void
    set<K extends keyof Sub>(k: K, v: Sub[K]): void
    apply<K extends keyof Sub>(k: K, f: (prev: Sub[K]) => Sub[K]): void
    on(eventName: 'update', cb: (v: Sub) => void): void
}

// Probably should just export makeFBCursor<Root> and make the <Sub> stuff a private function.
export function makeFBCursor<Root, Sub = Root>(
    docRef: firestore.DocumentReference<Root>,
    // collection: CollectionReference,
    // docId: string,
    path: string[]): FBCursor<Root, Sub> {
    // const docRef = doc(collection, docId)
    return {
        select<K extends keyof Sub>(k): FBCursor<Root, Sub[K]> {
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
        set(keyOrValue, maybeVal?) {
            if (maybeVal == null) {
                const value = keyOrValue
                if (path.length === 0) { docRef.update(value) }
                const keyString = path.join('.')
                docRef.update({ [keyString]: value })
            } else {
                const key = keyOrValue
                const value = maybeVal
                const keyString = [...path, key].join('.')
                docRef.update({ [keyString]: value })
            }
        },
        async apply(k, f) {
            const newPath = [...path, k as string]
            // https://stackoverflow.com/a/47296152
            const data = (await docRef.get()).data()
            const current = ldGet(data, newPath)
            const newVal = f(current)
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
