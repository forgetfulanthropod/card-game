import type { Cursorish, NetworkEvent, NetworkEventEmitter } from '@shared'
const config = { log: false }
// TODO: shouldn't store entire event history forever...

export function makeServerEventEmitter<Name extends string, Data>(name: Name, cursor: Cursorish<NetworkEvent<Name, Data>[]>): NetworkEventEmitter<Name, Data> {
    return {
        name,
        on(_cb) {
            throw Error('server cannot listen to events')
        },
        emit(data) {
            const event = {
                type: name,
                sentAt: new Date().toUTCString(),
                uid: 'eventUID' + Math.random().toString().slice(2, 6),
                data,
            }
            if (config.log) { console.log(`sending new ${name} event:`, event) }
            cursor.apply(events => [...events, event])
            // @ts-ignore
            cursor.commit()
        }
    }
}
