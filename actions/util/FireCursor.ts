import { diff } from 'deep-diff'
import { get, set, update } from 'lodash'
// type Objectish = Record<unknown, unknown>
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Objectish { }

const config = {
    logDiffOnFlush: false
}

class CursorRoot<Root extends Objectish> {
    constructor(
        public docRef: datastore.DocumentReference<Root>,
        public data: Root,
        public changeMade: boolean,
    ) { }
}

export class DataCursor<Root extends Objectish, Sub = Root> {
    constructor(public R: CursorRoot<Root>,
        private path: string[],
    ) { }
    select<K extends keyof Sub>(k: K): DataCursor<Root, Sub[K]> {
        const newPath = [...this.path, k as string]
        return new DataCursor<Root, Sub[K]>(this.R, newPath)
    }
    get(): Sub { return get(this.R.data, this.path) }
    getK<K extends keyof Sub>(k: K): Sub[K] { return get(this.R.data, [...this.path, k]) }
    set(value: Sub): void {
        this.R.changeMade = true
        set(this.R.data, this.path, value)
    }
    setK<K extends keyof Sub>(key: K, value: Sub[K]): void {
        this.R.changeMade = true
        set(this.R.data, [...this.path, key], value)
    }
    apply(func: (prev: Sub) => Sub): void {
        this.R.changeMade = true
        update(this.R.data, this.path, func)
    }
    applyK<K extends keyof Sub>(key: K, func: (prev: Sub[K]) => Sub[K]): void {
        this.R.changeMade = true
        update(this.R.data, [...this.path, key], func)
    }
    async flush(): Promise<void> {
        if (!this.R.changeMade) {
            console.log('congratulations you skipped an unnecessary change')
            return
        }
        // TODO?: update with diff instead of full thing?
        if (config.logDiffOnFlush) {
            const prev = (await this.R.docRef.get()).data()
            const differences = diff(prev, this.R.data)
            console.log('flushing data with differences...', JSON.stringify(differences))
        }
        await this.R.docRef.set(this.R.data)
        this.R.changeMade = false
    }
}
// TODO:
// export type DataCursor = typeof DataCursor

// declare global {
//     interface globalThis {
//         rootCursorInstance: DataCursor
//     }
// }
let rootInstance: DataCursor<Objectish> | null = null

export async function makeRootDataCursor<Root>(docRef: datastore.DocumentReference<Root>): Promise<DataCursor<Root, Root>> {
    if (rootInstance != null) {
        Object.assign(rootInstance.R.data, (await docRef.get()).data())
        return rootInstance as DataCursor<Root, Root>
    }
    const cursorRoot = new CursorRoot<Root>(docRef, (await docRef.get()).data() as Root, false)
    rootInstance = new DataCursor(cursorRoot, [])
    return rootInstance as DataCursor<Root, Root>
}
