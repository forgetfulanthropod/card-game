import type { EffectCallback, StateUpdater} from 'preact/hooks';
import { useCallback, useEffect, useState } from 'preact/hooks'

/* BUGGY:
type Subscription<T> = (val: T) => void
export interface EventEmitter<T> {
    emit(val: T): void
    useSubscription(callback: Subscription<T>): void
}
export function useEventEmitter<T = void>(): EventEmitter<T> {
    const subscriptions = useRef(new Set<Subscription<T>>())

    function emit(val: T) {
        subscriptions.current.forEach(s => s(val))
    }

    function useSubscription(callback: Subscription<T>) {
        useEffect(() => {
            subscriptions.current.add(callback)
            toast(`added listener ${subscriptions.current.size} ${callback.name}`)
            return () => {
                subscriptions.current.delete(callback)
                toast(`removed listener ${callback.name}`)
            }
        }, [callback])
    }
    return Object.freeze({ emit, useSubscription })
}
*/

export function useEffectWhen(effect: EffectCallback, deps: unknown[], watchedVals: unknown[]): void {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(useCallback(effect, deps), watchedVals)
}

export function useLog(stuff: Record<string, unknown>): void {
    const A = Object.values(stuff)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => { console.log(JSON.stringify(stuff)) }, A)
}


export function useResetState<T>(initial: T, delay?: number): [T, StateUpdater<T>] {
    const [t, setT] = useState(initial)
    useEffect(() => {
        if (t !== initial) {
            if (delay != null) {
                const id = setTimeout(() => {
                    setT(initial)
                }, delay)
                return () => clearTimeout(id)
            }
            setT(initial)
        }
        return () => { }
    }, [initial, delay, t])
    return [t, setT]
}
