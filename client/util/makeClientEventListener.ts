import type { Cursorish, NetworkEvent, NetworkEventEmitter } from '@shared'

const config = { log: false }

export function makeClientEventListener<Name extends string, Data>(name: Name, cursor: Cursorish<NetworkEvent<Name, Data>[]>): NetworkEventEmitter<Name, Data> {
    const callbacks: ((d: NetworkEvent<Name, Data>) => void)[] = []
    let numProcessed = 0
    if (typeof cursor.on !== 'function') {
        throw Error('cursorish thing has no .on')
    }
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
