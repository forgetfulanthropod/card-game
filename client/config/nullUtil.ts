export {}

declare global {
    function notNull<T>(
        value: T | null | undefined,
        name: string
    ): asserts value is Exclude<T, null | undefined>
    function throwNull(name: string): never
}

window.notNull = function notNull<T>(
    value: T,
    name: string
): asserts value is Exclude<T, null | undefined> {
    if (value == null) throw Error(`${name} is null`)
}

window.throwNull = function throwNull(name: string): never {
    throw Error(`'${name}' is null`)
}

/* Some regular expressions below for project updates:

Loose:
== null\)(?: \{)?[\s\n]*throw (?:new )?Error\(


No-curlies:
if \((.+?) == null\)[\s\n]*throw (?:new )?Error\((.*?)\)

Curlies:
if \((.+?) == null\) \{[\s\n]*throw (?:new )?Error\((.*?)\)[\s\n]*\}

Replace with:
notNull($1, $2)
*/
