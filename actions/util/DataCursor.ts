import { get, set, update } from 'lodash'
// type Objectish = Record<unknown, unknown>
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Objectish { }

const config = {
    logDiffOnFlush: false
}

class CursorRoot<Root extends Objectish> {
    constructor(
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
        return // TODO
    }
}
// TODO:
// export type DataCursor = typeof DataCursor

// declare global {
//     interface globalThis {
//         rootCursorInstance: DataCursor
//     }
// }

export function makeRootDataCursor<Root>(): DataCursor<Root, Root> {
    return null as unknown as DataCursor<Root, Root>
}
