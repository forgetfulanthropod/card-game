import type { Immutable } from '@shared'

/** Does deep freeze in place and returns result */
// eslint-disable-next-line @typescript-eslint/ban-types
export function deepFreeze<T extends object>(obj: T): Immutable<T> {
    // Retrieve the property names defined on object
    const propNames = Object.getOwnPropertyNames(obj)

    // Freeze properties before freezing self

    for (const name of propNames) {
        // @ts-expect-error
        const value = obj[name]

        if (value && typeof value === 'object') {
            deepFreeze(value)
        }
    }

    return Object.freeze(obj) as Immutable<T>
}

export function vals<K extends string | number, V>(obj: Record<K, V>): V[] {
    return Object.values(obj)
}
export function keys<K extends string | number, V>(obj: Record<K, V>): string[] {
    return Object.keys(obj)
}

export function length<K extends string | number>(obj: Record<K, unknown>): number {
    return Object.keys(obj).length
}

export function keyMap<K extends string | number, V, X>(obj: Record<K, V>, f: (k: string) => X): X[] {
    return Object.keys(obj).map(f)
}
export function entryMap<K extends string | number, V, X>(obj: Record<K, V>, f: (k: string, v: V) => X): X[] {
    return (Object.entries(obj) as [string, V][]).map(([k, v]) => f(k, v))
}

export function stringify(obj: Record<string, unknown>): string {
    return JSON.stringify(obj, null, 4)
}
