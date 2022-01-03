export function srandInt(min: number, under: number): number {
    return srandom() * (under - min) + min | 0
}

export function ssample<T>(arr: T[]): T {
    return arr[srandInt(0, arr.length)]
}
// Will be very slow when arr.length is large and n is near arr.length
export function ssampleSize<T>(arr: T[], n: number): T[] {
    if (n > arr.length) {
        throw Error('n larger than arr.length')
    }
    if (n <= 0) {
        return []
    }
    const indices: number[] = []
    while (indices.length < n) {
        const i = srandInt(0, arr.length)
        if (!indices.includes(i)) {
            indices.push(i)
        }
    }
    return indices.map(i => arr[i])
}

export function randomEl<T>(arr: readonly T[]): T {
    return arr[srandom() * arr.length | 0]
}

/** Returns index of chosen element */
export function weightedRandom(probabilites: number[]): number {
    if (
        probabilites.some(x => Number.isNaN(x) || !Number.isFinite(x) || x < 0)
    ) {
        logger.error('array contains NaN or Inf or negative numbers')
        return 0
    }
    let runningTotal = 0
    const runningTotals = []
    for (let i = 0; i < probabilites.length; i++) {
        runningTotal += probabilites[i]
        runningTotals[i] = runningTotal
    }
    const total = runningTotal
    const x = srandom() * total
    const index = runningTotals.findIndex(t => t > x)
    if (index !== -1) return index
    // hits e.g. when all probabilities are 0
    return srandom() * probabilites.length | 0
}
