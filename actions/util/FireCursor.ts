import { diff } from 'deep-diff'
import type { firestore } from 'firebase-admin'
import { get, set, update } from 'lodash'
// type Objectish = Record<unknown, unknown>
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Objectish { }

const config = {
    logDiffOnFlush: false
}

export class FireCursor<Root extends Objectish, Sub = Root> {
    constructor(private docRef: firestore.DocumentReference<Root>,
        private path: string[],
        public rootData: Root) { }
    select<K extends keyof Sub>(k: K): FireCursor<Root, Sub[K]> {
        const newPath = [...this.path, k as string]
        return new FireCursor<Root, Sub[K]>(this.docRef, newPath, this.rootData)
    }
    get(): Sub { return get(this.rootData, this.path) }
    getK<K extends keyof Sub>(k: K): Sub[K] { return get(this.rootData, [...this.path, k]) }
    set(value: Sub): void { set(this.rootData, this.path, value) }
    setK<K extends keyof Sub>(key: K, value: Sub[K]): void {
        // console.log(`firecursor setting ${key} to ${JSON.stringify(value)}`)
        // debugger
        set(this.rootData, [...this.path, key], value)
    }
    apply(func: (prev: Sub) => Sub): void { update(this.rootData, this.path, func) }
    applyK<K extends keyof Sub>(key: K, func: (prev: Sub[K]) => Sub[K]): void { update(this.rootData, [...this.path, key], func) }
    async flush(): Promise<void> {
        // TODO?: update with diff instead of full thing?
        if (config.logDiffOnFlush) {
            const prev = (await this.docRef.get()).data()
            const differences = diff(prev, this.rootData)
            console.log('flushing data with differences...', JSON.stringify(differences))
        }
        await this.docRef.set(this.rootData)
    }
}
// TODO:
// export type FireCursor = typeof FireCursor

// declare global {
//     interface globalThis {
//         rootCursorInstance: FireCursor
//     }
// }

export async function makeRootFireCursor<Root>(docRef: firestore.DocumentReference<Root>): Promise<FireCursor<Root, Root>> {
    // @ts-ignore
    if (global.rootCursorInstance != null) {
        // TODO: delete old fields from global.rootCursorInstance before object.assign
        // @ts-ignore
        Object.assign(global.rootCursorInstance.rootData, (await docRef.get()).data())
        // @ts-ignore
        return global.rootCursorInstance
    }
    // @ts-ignore
    global.rootCursorInstance = new FireCursor(docRef, [], (await docRef.get()).data())
    // @ts-ignore
    return global.rootCursorInstance
}
