import { useRef, useEffect } from 'react'

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
            return () => {
                subscriptions.current.delete(callback)
            }
        }, [callback])
    }
    return Object.freeze({ emit, useSubscription })
}
