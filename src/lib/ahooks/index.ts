import Preact from 'preact'
import { useEffect, useRef } from 'preact/hooks'
type Subscription<T> = (val: T) => void

export class EventEmitter<T> {
    private subscriptions = new Set<Subscription<T>>();

    emit = (val: T) => {
        for (const subscription of this.subscriptions) {
            subscription(val)
        }
    };

    useSubscription = (callback: Subscription<T>) => {
        const callbackRef = useRef<Subscription<T>>()
        callbackRef.current = callback
        useEffect(() => {
            function subscription(val: T) {
                if (callbackRef.current) {
                    callbackRef.current(val)
                }
            }
            this.subscriptions.add(subscription)
            return () => {
                this.subscriptions.delete(subscription)
            }
        }, [])
    };
}

export function useEventEmitter<T = void>() {
    const ref = useRef<EventEmitter<T>>()
    if (!ref.current) {
        ref.current = new EventEmitter()
    }
    return ref.current
}

export function useSize(ref: Preact.RefObject<HTMLDivElement>) {
    return { width: 100, height: 100 }
}
