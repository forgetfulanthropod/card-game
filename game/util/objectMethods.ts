export function vals<K extends string | number, V>(obj: Record<K, V>): V[] {
    return Object.values(obj)
}
export function keys<K extends string | number, V>(
    obj: Record<K, V>
): string[] {
    return Object.keys(obj)
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
