export function notnull<T>(name: string, x: T | null | undefined): T {
    if (x == null) { throw Error(`${name} is not defined`) }
    return x
}
