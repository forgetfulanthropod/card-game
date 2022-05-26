const config = { checkNumbersAreFinite: true } as const

export function assertFinite<
    T extends number | number[] | Record<PropertyKey, number>
>(val: T): T {
    if (!config.checkNumbersAreFinite) return val
    if (Array.isArray(val)) {
        for (let i = 0; i < val.length; i++)
            if (!isFinite(val[i]))
                throw Error(
                    `value '${val[i]}' at index ${i} is not a finite number`
                )
    } else if (typeof val === 'object' && val != null) {
        for (const [k, v] of Object.entries(val))
            if (!isFinite(v))
                throw Error(`value '${v}' at key ${k} is not a finite number`)
    } else {
        if (!isFinite(val)) throw Error(`value '${val}' is not a finite number`)
    }
    return val
}
