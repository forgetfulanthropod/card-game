export function vals<K extends string | number, V>(obj: Record<K, V>): V[] {
    return Object.values(obj)
}
export function keys<K extends string | number, V>(obj: Record<K, V>): string[] {
    return Object.keys(obj)
}
export function stringKeys<K extends string, V>(obj: Record<K, V>): K[] {
    return Object.keys(obj) as K[]
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
export function objFilter<K extends string | number, V>(obj: Record<K, V>, f: (k: string, v: V) => boolean): Record<K, V> {
    // @ts-ignore
    const o: Record<K, V> = {};
    (Object.entries(obj) as [K, V][]).forEach(([k, v]) => { if (f(k as string, v)) o[k] = v })
    return o
}
