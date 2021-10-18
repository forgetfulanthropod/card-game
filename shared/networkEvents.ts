
/** Emulate event emitters over network with firestore updates.
 * Probably gonna break down eventually but we can write a new shim when it does
 */

import type { AttackData } from '.'

const config = { log: false }


export interface NetworkEventEmitter<Name extends string, Data> {
    name: Name
    on(cb: (d: NetworkEvent<Name, Data>) => void): void
    emit(data: Data): void
}

export interface NetworkEvent<Name extends string, Data> {
    type: Name
    sentAt: string
    uid: string
    data: Data
}

export type MoveEmitter = NetworkEventEmitter<'move', MoveEvent>
export type MoveEvent = NetworkEvent<'move', AttackData>

export interface Cursorish<T> {
    apply(updater: (x: T) => T): void
    get(): T | Promise<T>
    on(_: 'update', cb: () => void): void
}

export function makeClientEventListener<Name extends string, Data>(name: Name, cursor: Cursorish<NetworkEvent<Name, Data>[]>): NetworkEventEmitter<Name, Data> {
    const callbacks: ((d: NetworkEvent<Name, Data>) => void)[] = []
    let numProcessed = 0
    cursor.on('update', async () => {
        const allEvents = await cursor.get()
        const newEvents = allEvents.slice(numProcessed)
        for (const e of newEvents) {
            if (config.log) { console.log(`received new ${name} event:`, e) }
            for (const cb of callbacks) {
                cb(e)
            }
        }
        numProcessed = allEvents.length
    })
    return {
        name,
        on(cb) {
            callbacks.push(cb)
        },
        emit(_event) {
            throw Error('client cannot emit events')
        }
    }

}
