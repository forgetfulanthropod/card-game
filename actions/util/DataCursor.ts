import type { Gamestate, Immutable, } from '@shared/index'
import { MyCursor, MyBaobab } from '../shared/myBaobab'
import { get, memoize, set, update } from 'lodash'
import { getRootCursor, RootTreeShit } from './getters'
import { getIo } from '..'
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
    constructor(private bc: MyCursor<Sub>) {
    }
    get(): Sub { return this.bc.get() }
    getK<K extends keyof Sub>(k: K): Sub[K] { return this.bc.get(k) }
    set(value: Sub): Sub { return this.bc.set(value) }
    setK<K extends keyof Sub>(key: K, value: Sub[K]): void {
        this.bc.set(key, value)
    }
    apply(update: (s: Sub) => Sub): Sub { return this.bc.apply(update) }
    applyK<K extends keyof Sub>(key: K, func: (prev: Immutable<Sub[K]>) => Immutable<Sub[K]>): void {
        this.bc.apply(key, func)
    }
    select<K extends keyof Sub>(k: K) { return new DataCursor(this.bc.select(k)) }
    async flush(): Promise<void> {
        console.log('flushing')
        getIo().emit('update', getRootCursor().select('users').select('alice').get())
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

export const makeRootDataCursor = memoize(function makeRootDataCursor(): DataCursor<RootTreeShit> {
    const b = new MyBaobab({
        contents: {
            users: {
                alice: null as unknown as Gamestate

            },
            testCounters: { counter0: 0 }
        }
    })
    console.log('guest')
    const c = b.select('contents')
    console.log('west')
    return new DataCursor(c)
})
