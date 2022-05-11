import type { ROCursor, SCursor } from 'sbaobab'

type Unsubscribe = () => void
export function onUpdate<T>(
    cursor: ROCursor<T> | SCursor<T>,
    callback: (t: T) => void,
    runImmediately = false
): Unsubscribe {
    const cb = ({ data: { currentData } }: { data: { currentData: T } }) =>
        callback(currentData)
    cursor.on('update', cb)
    if (runImmediately) {
        callback(cursor.get())
    }
    return () => cursor.off('update', cb)
}
