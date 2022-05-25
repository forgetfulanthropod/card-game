import type { Datum, RODatum } from 'datums'
import { datum } from 'datums'
import type { ROCursor, SCursor } from 'sbaobab'
import { onUpdate } from './onUpdate'

export function toDatum<T, S = T>(
    cursor: ROCursor<T> | SCursor<T>,
    compute: (x: T) => S
): RODatum<S> & { destroy: Callback } {
    const d = datum(compute(cursor.get())) as Datum<S> & { destroy: Callback }
    d.destroy = onUpdate(cursor, x => d.set(compute(x)), true)
    return d
}
