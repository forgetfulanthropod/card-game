// @ts-nocheck
import type { BaobabOptions } from 'baobab'
import Baobab, { Cursor } from 'baobab'

// eslint-disable-next-line @typescript-eslint/ban-types
type MyObject = object

// https://stackoverflow.com/a/65963590
type PathTree<T> = {
    [P in keyof T]-?: T[P] extends MyObject
    ? [P] | [P, ...AllPaths<T[P]>]
    : [P]
}

export type AllPaths<T> = PathTree<T>[keyof PathTree<T>]


// https://stackoverflow.com/a/61648690
export type DeepIndex<T, KS extends Keys, Fail = undefined> =
    KS extends [infer F, ...infer R] ? F extends keyof T ? R extends Keys ?
    DeepIndex<T[F], R, Fail> : Fail : Fail : T

type Keys = readonly PropertyKey[]

type Immutable<T> =
    T extends ImmutablePrimitive ? T :
    T extends Array<infer U> ? ImmutableArray<U> :
    T extends Map<infer K, infer V> ? ImmutableMap<K, V> :
    T extends Set<infer M> ? ImmutableSet<M> : ImmutableObject<T>

type ImmutableArray<T> = ReadonlyArray<Immutable<T>>
type ImmutableMap<K, V> = ReadonlyMap<Immutable<K>, Immutable<V>>
type ImmutableSet<T> = ReadonlySet<Immutable<T>>
type ImmutableObject<T> = { readonly [K in keyof T]: Immutable<T[K]> }


export class MyBaobab<T extends any> extends Baobab {
    constructor(initialState?: T, options?: Partial<BaobabOptions>) {
        super(initialState, options)
    }

    root: MyCursor<T>
    options: BaobabOptions

    apply(getNew: (state: T) => T): T { return super.apply(path, getNew) }
    apply<K extends keyof T>(path: K, getNew: (state: Immutable<T[K]>) => Immutable<T[K]>): MyCursor<T[K]>
    apply<K extends AllPaths<T>>(path: K, getNew: (state: Immutable<T[K]>) => Immutable<T[K]>): DeepIndex<T, K> { return super.apply(path, getNew) }
    // apply<K extends keyof T>(path: K, getNew: (state: T[K]) => T[K]): MyCursor<T[K]>
    // apply<K extends AllPaths<T>>(path: K, getNew: (state: T[K]) => T[K]): DeepIndex<T, K> { return super.apply(path, getNew) }

    select<K extends keyof T>(path: K): MyCursor<T[K]>
    select<K extends AllPaths<T>>(path: K): MyCursor<DeepIndex<T, K>> { return super.select(path) }
    // select<K extends AllPaths<T>>(...path: K): MyCursor<DeepIndex<T, K>> { return super.select(path) }

    set(value: T): T { return super.set(value) }
    set<K extends keyof T>(path: K, value: T[K]): T[K]
    set<K extends AllPaths<T>>(path: K, value: T[K]): DeepIndex<T, K> { return super.set(path, value) }

    get(): T { return super.get() }
    get<K extends keyof T>(path: K): T[K]
    get<K extends AllPaths<T>>(path: K): DeepIndex<T, K> { return super.apply(path) }
}


export class MyCursor<T extends any> extends Cursor {
    constructor() { super() }
    apply(getNew: (state: T) => T): T { return super.apply(getNew) }
    apply<K extends keyof T>(path: K, getNew: (state: Immutable<T[K]>) => Immutable<T[K]>): MyCursor<T[K]>
    apply<K extends AllPaths<T>>(path: K, getNew: (state: Immutable<T[K]>) => Immutable<T[K]>): DeepIndex<T, K> { return super.apply(path, getNew) }

    select<K extends keyof T>(path: K): MyCursor<T[K]>
    select<K extends AllPaths<T>>(path: K): MyCursor<DeepIndex<T, K>> { return super.select(path) }
    // select<K extends AllPaths<T>>(...path: K): MyCursor<DeepIndex<T, K>> { return super.select(path) }

    set(value: T): T { return super.set(value) }
    set<K extends keyof T>(path: K, value: T[K]): T[K]
    set<K extends AllPaths<T>>(path: K, value: T[K]): DeepIndex<T, K> { return super.set(path, value) }

    get(): T { return super.get() }
    get<K extends keyof T>(path: K): T[K]
    get<K extends AllPaths<T>>(path: K): DeepIndex<T, K> { return super.apply(path) }

}
