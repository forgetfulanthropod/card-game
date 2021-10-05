// @ts-nocheck
import Baobab, { BaobabOptions, Cursor } from 'baobab'

interface EmptyInterface { }

// https://stackoverflow.com/a/65963590
type PathTree<T> = {
    [P in keyof T]-?: T[P] extends object
    ? [P] | [P, ...AllPaths<T[P]>]
    : [P]
}

type AllPaths<T> = PathTree<T>[keyof PathTree<T>]


// https://stackoverflow.com/a/61648690
type DeepIndex<T, KS extends Keys, Fail = undefined> =
    KS extends [infer F, ...infer R] ? F extends keyof T ? R extends Keys ?
    DeepIndex<T[F], R, Fail> : Fail : Fail : T

type Keys = readonly PropertyKey[]

export class MyBaobab<T extends EmptyInterface> extends Baobab {
    constructor(initialState?: T, options?: Partial<BaobabOptions>) {
        super(initialState, options)
    }

    root: MyCursor<T>
    options: BaobabOptions

    apply(getNew: (state: T) => T): T { return super.apply(path, getNew) }
    apply<K extends keyof T>(path: K, getNew: (state: T[K]) => T[K]): MyCursor<T[K]>
    apply<K extends AllPaths<T>>(path: K, getNew: (state: T[K]) => T[K]): DeepIndex<T, K> { return super.apply(path, getNew) }

    select<K extends keyof T>(path: K): MyCursor<T[K]>
    select<K extends AllPaths<T>>(path: K): MyCursor<DeepIndex<T, K>> { return super.select(path) }

    set(getNew: T): T { return super.set(getNew) }
    set<K extends keyof T>(path: K, getNew: T[K]): T[K]
    set<K extends AllPaths<T>>(path: K, getNew: T[K]): DeepIndex<T, K> { return super.set(path, getNew) }

    get(): T { return super.get() }
    get<K extends keyof T>(path: K): T[K]
    get<K extends AllPaths<T>>(path: K): DeepIndex<T, K> { return super.apply(path) }
}


export class MyCursor<T extends EmptyInterface> extends Cursor {
    constructor() { super() }
    apply(getNew: (state: T) => T): T { return super.apply(path, getNew) }
    apply<K extends keyof T>(path: K, getNew: (state: T[K]) => T[K]): MyCursor<T[K]>
    apply<K extends AllPaths<T>>(path: K, getNew: (state: T[K]) => T[K]): DeepIndex<T, K> { return super.apply(path, getNew) }

    select<K extends keyof T>(path: K): MyCursor<T[K]>
    select<K extends AllPaths<T>>(path: K): MyCursor<DeepIndex<T, K>> { return super.select(path) }

    set(getNew: T): T { return super.set(getNew) }
    set<K extends keyof T>(path: K, getNew: T[K]): T[K]
    set<K extends AllPaths<T>>(path: K, getNew: T[K]): DeepIndex<T, K> { return super.set(path, getNew) }

    get(): T { return super.get() }
    get<K extends keyof T>(path: K): T[K]
    get<K extends AllPaths<T>>(path: K): DeepIndex<T, K> { return super.apply(path) }

}
