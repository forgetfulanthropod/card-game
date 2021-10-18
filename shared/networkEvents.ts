
/** Emulate event emitters over network with firestore updates.
 * Probably gonna break down eventually but we can write a new shim when it does
 */

import type { AttackData } from '.'

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
