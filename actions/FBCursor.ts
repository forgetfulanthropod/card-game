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
            const keys = [...path, k as string]
            return makeFBCursor<Root, Sub[K]>(docRef, keys)
        },
        async get(k?) {
            const data = (await docRef.get()).data
            if (path.length === 0) { return data }
            if (k == null) {
                return ldGet(data, [...path, k].join('.'))
            }
            else {
                return ldGet(data, path.join('.'))
            }
        },
        set(kOrV, val?) {
            if (val == null) {
                const value = kOrV
                if (path.length === 0) { docRef.update(value) }
                const keyString = path.join('.')
                docRef.update({ [keyString]: value })
            } else {
                const key = kOrV
                const value = val
                const keyString = [...path, key].join('.')
                docRef.update({ [keyString]: value })
            }
        },
        async apply(k, f) {
            const keys = [...path, k as string]
            // https://stackoverflow.com/a/47296152
            const data = (await docRef.get()).data
            const current = ldGet(data, keys)
            const newVal = f(current)
            const keyString = keys.join('.')
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
