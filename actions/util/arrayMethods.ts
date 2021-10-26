
export function mapToObj<T, S>(A: T[], f: (t: T) => [string, S]): Record<string, S> {
    const o: Record<string, S> = {}
    A.forEach(x => {
        const [k, v] = f(x)
        o[k] = v
    })
    return o
}
