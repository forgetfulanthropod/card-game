import { Immutable } from '@/config/immutable'

export function styled<T extends keyof HTMLElementTagNameMap>(kind: T, className: string): HTMLElementTagNameMap[T] {
    const elm = document.createElement(kind)
    elm.className = className
    return elm
}

/** Does deep freeze in place and returns result */
// eslint-disable-next-line @typescript-eslint/ban-types
export function deepFreeze<T extends object>(obj: T): Immutable<T> {
    // Retrieve the property names defined on object
    const propNames = Object.getOwnPropertyNames(obj)

    // Freeze properties before freezing self

    for (const name of propNames) {
        // @ts-ignore
        const value = obj[name]

        if (value && typeof value === 'object') {
            deepFreeze(value)
        }
    }

    return Object.freeze(obj) as Immutable<T>
}

// returns
export function set<T>(arr: readonly T[], i: number, t: T): T[] {
    const newArr = [...arr]
    newArr[i] = t
    return newArr
}

export function vals<K extends string | number, V>(obj: Record<K, V>): V[] {
    return Object.values(obj)
}
export function keys<K extends string | number, V>(obj: Record<K, V>): string[] {
    return Object.keys(obj)
}
export function entries<K extends string | number, V>(obj: Record<K, V>): [string, V][] {
    return Object.entries(obj)
}


export function length<K extends string | number>(obj: Record<K, unknown>): number {
    return Object.keys(obj).length
}

export function valMap<K extends string | number, V, V2>(obj: Record<K, V>, f: (v: V) => V2): V2[] {
    return (Object.values(obj) as V[]).map(v => f(v))

}
export function keyMap<K extends string | number, V, X>(obj: Record<K, V>, f: (k: string) => X): X[] {
    return Object.keys(obj).map(f)
}
export function entryMap<K extends string | number, V, X>(obj: Record<K, V>, f: (k: string, v: V) => X): X[] {
    return (Object.entries(obj) as [string, V][]).map(([k, v]) => f(k, v))
}
export function objMap<K extends string | number, V, X>(obj: Record<K, V>, f: (k: string, v: V) => X): Record<K, X> {
    // @ts-ignore
    const o: Record<K, X> = {};
    (Object.entries(obj) as [K, V][]).forEach(([k, v]) => o[k] = f(k as string, v))
    return o
}
