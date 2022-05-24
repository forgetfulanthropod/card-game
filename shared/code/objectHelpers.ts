export function vals<K extends string | number, V>(obj: Record<K, V>): V[] {
    return Object.values(obj)
}
export function keys<K extends string | number, V>(obj: Record<K, V>): K[] {
    // @ts-expect-error
    return Object.keys(obj)
}

// export function keys2<T>(obj: T): { [K in keyof T]: K } {
//     return Object.keys(obj)
// }

export function length<K extends string | number>(
    obj: Record<K, unknown>
): number {
    return Object.keys(obj).length
}

export function keyMap<K extends string | number, V, X>(
    obj: Record<K, V>,
    f: (k: string) => X
): X[] {
    return Object.keys(obj).map(f)
}
export function entryMap<K extends string | number, V, X>(
    obj: Record<K, V>,
    f: (k: K, v: V) => X
): Record<K, X> {
    return Object.fromEntries(
        (Object.entries(obj) as [K, V][]).map(([k, v]) => [k, f(k, v)])
    ) as Record<K, X>
}

export function stringify(obj: Record<string, unknown>): string {
    return JSON.stringify(obj, null, 4)
}

export function stringKeys<K extends string, V>(obj: Record<K, V>): K[] {
    return Object.keys(obj) as K[]
}
export function objFilter<K extends string | number, V>(
    obj: Record<K, V>,
    f: (k: string, v: V) => boolean
): Record<K, V> {
    // @ts-expect-error
    const o: Record<K, V> = {}
    // eslint-disable-next-line no-extra-parens
    ;(Object.entries(obj) as [K, V][]).forEach(([k, v]) => {
        if (f(k as string, v)) o[k] = v
    })
    return o
}
