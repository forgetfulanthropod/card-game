import { Cursorish, NetworkEvent, NetworkEventEmitter } from '@shared/networkEvents'

const config = { log: false }

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
