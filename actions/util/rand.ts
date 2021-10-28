export function srandInt(min: number, under: number): number {
    return (srandom() * (under - min) + min) | 0
}

export function ssample<T>(arr: T[]): T {
    return arr[srandInt(0, arr.length)]
}
// Will be very slow when arr.length is large and n is near arr.length
export function ssampleSize<T>(arr: T[], n: number): T[] {
    if (n > arr.length) { throw Error('n larger than arr.length') }
    if (n <= 0) { return [] }
    const indices: number[] = []
    while (indices.length < n) {
        const i = srandInt(0, arr.length)
        if (!indices.includes(i)) {
            indices.push(i)
        }
    }
    return indices.map(i => arr[i])
}
