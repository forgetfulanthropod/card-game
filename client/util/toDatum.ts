import type { Datum, RODatum } from 'datums'
import { datum } from 'datums'
import type { ROCursor, SCursor } from 'sbaobab'
import { onUpdate } from './onUpdate'

/** NOTE: automatically unsubscribes if cursor gets value `undefined` */
export function toDatum<T, S = T>(
    cursor: ROCursor<T> | SCursor<T>,
    compute: (x: T) => S = x => x as unknown as S,
    options?: { allowUndefined: boolean }
): RODatum<S> & { destroy: Callback } {
    const d = datum(compute(cursor.get())) as Datum<S> & { destroy: Callback }
    d.destroy = onUpdate(
        cursor,
        x => {
            if (x === undefined && !options?.allowUndefined) {
                // undefined in rare cases
                if (d.destroy == null) setTimeout(() => d?.destroy?.(), 0)
                else d.destroy()
                return
            }
            d.set(compute(x))
        },
        true
    )
    return d
}
