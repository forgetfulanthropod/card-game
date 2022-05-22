export function mapToObj<T, K extends PropertyKey, V>(
    A: T[],
    f: (t: T, i: number) => [K, V]
): Record<K, V> {
    // @ts-expect-error
    const o: Record<K, V> = {}
    A.forEach((x, i) => {
        const [k, v] = f(x, i)
        o[k] = v
    })
    return o
}
