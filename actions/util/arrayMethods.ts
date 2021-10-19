export function zip<T, S>(arr1: T[], arr2: S[], mode: 'shorter' | 'longer' = 'shorter'): [T, S][] {
    const n = mode === 'shorter' ? Math.min(arr1.length, arr2.length) : Math.max(arr1.length, arr2.length)
    return Array(n).fill(null).map((_, i) => [arr1[i], arr2[i]])
}

export function mapToObj<T, S>(A: T[], f: (t: T) => [string, S]): Record<string, S> {
    const o: Record<string, S> = {}
    A.forEach(x => {
        const [k, v] = f(x)
        o[k] = v
    })
    return o
}
