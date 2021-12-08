export function mapToObj<T, S>(A: T[], f: (t: T, i: number) => [string, S]): Record<string, S> {
    const o: Record<string, S> = {}
    A.forEach((x, i) => {
        const [k, v] = f(x, i)
        o[k] = v
    })
    return o
}
