import type { AllPaths, DeepIndex } from '@shared/myBaobab'
import type { DocumentReference, UpdateData } from 'firebase/firestore'
import { updateDoc } from 'firebase/firestore'
import { onSnapshot } from 'firebase/firestore'
import { getDoc } from 'firebase/firestore'
import ldGet from 'lodash/get'

// type Objectish = Record<string, unknown>
// type PathsOf<Root, Path extends AllPaths<Root>> = AllPaths<DeepIndex<Root, Path>>
type KeyAt<Root, Path extends AllPaths<Root>> = keyof DeepIndex<Root, Path>
export interface FBCursor<Root, Path extends AllPaths<Root> = []> {
    select<K extends KeyAt<Root, Path>>(k: K): FBCursor<Root, [...Path, K]>
    get(): Promise<DeepIndex<Root, Path>>
    get<K extends KeyAt<Root, Path>>(k: K): Promise<DeepIndex<Root, [...Path, K]>>
    set(v: DeepIndex<Root, Path>): void
    set<K extends KeyAt<Root, Path>>(k: K, v: DeepIndex<Root, [...Path, K]>): void
    apply<K extends KeyAt<Root, Path>>(k: K, f: (prev: DeepIndex<Root, Path>) => DeepIndex<Root, Path>): void
    on(eventName: 'update', cb: (v: T) => void): void
}
export function makeFBCursor<Root, Path extends AllPaths<Root> = []>(
    docRef: DocumentReference<Root>,
    // collection: CollectionReference,
    // docId: string,
    subKeys: Path): FBCursor<Root, Path> {
    // const docRef = doc(collection, docId)
    return {
        async select<K extends KeyAt<Root, Path>>(k) {
            const keys = [...subKeys, k as string]
            return makeFBCursor<Root, [...Path, K]>(docRef, keys)
        },
        async get(k?) {
            const data = (await getDoc(docRef)).data
            if (k == null) {
                return ldGet(data)
            }
            else {
                return (await getDoc(docRef)).data
            }
        },
        set(kOrV, val?) {
            if (val == null) {
                const v = kOrV
                const keyString = keys.join('.')
                updateDoc(docRef, { [keyString]: v })
            } else {
                const k = kOrV
                const keyString = [...keys, k].join('.')
                updateDoc(docRef, { [keyString]: v })
            }
        },
        async apply(k, f) {
            const keys = [...subKeys, k as string]
            // https://stackoverflow.com/a/47296152
            const data = (await getDoc(docRef)).data
            const current = ldGet(data, keys)
            const newVal = f(current)
            const keyString = keys.join('.')
            // TODO: explicit cast shouldn't be necessary
            await updateDoc(docRef, { [keyString]: newVal } as UpdateData<Root>)
        },
        on(_, cb) {
            onSnapshot(docRef, doc => {
                cb(doc.data())
            })
        },
    }
}
