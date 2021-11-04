export function notnull<T>(x: T | null | undefined): T {
    if (x == null) { throw Error('null value encounutered') }
    return x
}
