export function mapToObj<K extends PropertyKey, V>(
    A: K[] | readonly K[],
    f: (t: K, i: number) => V
): Record<K, V> {
    // @ts-expect-error
    const o: Record<K, V> = {}
    A.forEach((x, i) => {
        const v = f(x, i)
        o[x] = v
    })
    return o
}

export function nonNulls<T>(arr: (null | undefined | T)[]): T[] {
    return arr.filter(x => x != null) as T[]
}
