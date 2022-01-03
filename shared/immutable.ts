// https://stackoverflow.com/a/58993872/4941530

type ImmutablePrimitive =
    | undefined
    | null
    | boolean
    | string
    | number
    | Function // eslint-disable-line @typescript-eslint/ban-types

export type Immutable<T> = T extends ImmutablePrimitive
    ? T
    : T extends Array<infer U>
    ? ImmutableArray<U>
    : T extends Map<infer K, infer V>
    ? ImmutableMap<K, V>
    : T extends Set<infer M>
    ? ImmutableSet<M>
    : ImmutableObject<T>

export type ImmutableArray<T> = ReadonlyArray<Immutable<T>>
export type ImmutableMap<K, V> = ReadonlyMap<Immutable<K>, Immutable<V>>
export type ImmutableSet<T> = ReadonlySet<Immutable<T>>
export type ImmutableObject<T> = { readonly [K in keyof T]: Immutable<T[K]> }
