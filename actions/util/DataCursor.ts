import { Gamestate, Immutable, MyBaobab, MyCursor } from '@shared/index'
import { get, set, update } from 'lodash'
import { RootTreeShit } from './getters'
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

export class DataCursor<Root extends Objectish, Sub = Root> extends MyCursor<Sub> {
    constructor(private boababCursor: MyCursor<Sub>) {
        super()
    }
    getK<K extends keyof Sub>(k: K): Sub[K] { return this.get(k) }
    setK<K extends keyof Sub>(key: K, value: Sub[K]): void {
        this.set(key, value)
    }
    applyK<K extends keyof Sub>(key: K, func: (prev: Immutable<Sub[K]>) => Immutable<Sub[K]>): void {
        this.apply(key, func)
    }
    select<K extends keyof Sub>(k: K) { return new DataCursor(this.boababCursor.select(k)) }
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

export function makeRootDataCursor(): DataCursor<RootTreeShit> {
    const b = new MyBaobab({
        contents: {
            users: {
                alice: null as unknown as Gamestate
            },
            testCounters: { counter0: 0 }
        }
    })
    return new DataCursor(b.select('contents'))
}
