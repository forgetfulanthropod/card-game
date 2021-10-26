import type { Gamestate, Immutable, MyCursor } from '@shared'
import { MyBaobab } from '@shared'
import { memoize } from 'lodash'

import { getIo } from '@/index'

import type { RootTreeShit } from './treeAccessors'
import { getRootCursor } from './treeAccessors'


// type Objectish = Record<unknown, unknown>
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Objectish { }


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
    select<K extends keyof Sub>(k: K): DataCursor<Sub[K]> { return new DataCursor(this.bc.select(k)) }
    commit(customName?: string, justSub = false): void {
        // TODO eventually: just commit Sub probably or maybe commit changes (diff)
        console.log('committing')
        if (customName != null) { console.log('committing to event name ', customName, 'and justSub is', justSub) }
        if (justSub) {
            getIo().emit(customName ?? 'update', this.bc.get())
            return
        }
        getIo().emit(customName ?? 'update', getRootCursor().select('users').select('alice').get())
        // TODO
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
