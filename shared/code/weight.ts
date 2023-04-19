export const weightsToCDF = (
    weights: Record<any, number>
): Record<any, number> => {
    const totalWeight = Object.values(weights).reduce(
        (prev, cur) => cur + prev,
        0
    )
    let s = 0
    const numValues = Object.keys(weights).length
    if (totalWeight == 0) {
        return Object.fromEntries(
            Object.keys(weights).map((id, i) => {
                s += 1 / numValues
                return i == numValues - 1 ? [id, 1] : [id, s]
            })
        )
    }
    // let total = 0
    // const weightCdf: Record<any, number> = Object.fromEntries(
    //     Object.entries(weights).map(([id, t]) => {
    //         s += t
    //         total += t
    //         return [id,s]
    //     }).map( ([id, t]) => [id, (t as number)/total])
    // )
    const weightCdf: Record<any, number> = Object.fromEntries(
        Object.entries(weights).map(([id, t], i) => {
            let normalWeight = t / totalWeight
            s += normalWeight
            return i == weights.length - 1 ? [id, 1] : [id, s]
        })
    )
    return weightCdf
}
