import { Immutable } from '@/config/immutable'

export function styled<T extends keyof HTMLElementTagNameMap>(kind: T, className: string): HTMLElementTagNameMap[T] {
    const elm = document.createElement(kind)
    elm.className = className
    return elm
}

/** Does deep freeze in place and returns result */
// eslint-disable-next-line @typescript-eslint/ban-types
export function deepFreeze<T extends object>(obj: T): Immutable<T> {
    // Retrieve the property names defined on object
    const propNames = Object.getOwnPropertyNames(obj)

    // Freeze properties before freezing self

    for (const name of propNames) {
        // @ts-ignore
        const value = obj[name]

        if (value && typeof value === 'object') {
            deepFreeze(value)
        }
    }

    return Object.freeze(obj) as Immutable<T>
}

// returns
export function set<T>(arr: readonly T[], i: number, t: T): T[] {
    const newArr = [...arr]
    newArr[i] = t
    return newArr
}
