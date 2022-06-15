/*
export function notnull<T>(name: string, x: T | null | undefined): T {
    if (x == null) {
        throw Error(`${name} is not defined`)
    }
    return x
}
*/

/** Asserts none of the keys of the object are null */
export function notnull(obj: Record<string, unknown>) {
    for (const key of Object.keys(obj)) {
        if (obj[key] == null) {
            throw Error(`'${key}' is not defined`)
        }
    }
}

export function throwNull(name: string): never {
    throw Error(`'${name}' is null`)
}
