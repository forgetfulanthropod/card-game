import Baobab, { Cursor } from 'baobab'

interface EmptyInterface { }

// https://stackoverflow.com/a/65963590
type PathTree<T> = {
    [P in keyof T]-?: T[P] extends object
    ? [P] | [P, ...AllPaths<T[P]>]
    : [P]
}

type AllPaths<T> = PathTree<T>[keyof PathTree<T>]

type AnyKey<T> = AllPaths<T> | keyof T

// https://stackoverflow.com/a/61648690
type DeepIndex<T, KS extends Keys, Fail = undefined> =
    KS extends [infer F, ...infer R] ? F extends keyof T ? R extends Keys ?
    DeepIndex<T[F], R, Fail> : Fail : Fail : T


export class MyBaobab<T extends EmptyInterface> extends Baobab {
    constructor(initialState?: T, options?: Partial<BaobabOptions>)

    root: MyCursor<T>
    options: BaobabOptions

    apply<K extends AnyKey<T>>(path: K, getNew: (state: T[K]) => T[K]): DeepIndex<T, K>
    apply(getNew: (state: T) => T): T
    select<K extends AnyKey<T>>(path: K): MyCursor<DeepIndex<T, K>>
    set<K extends AnyKey<T>>(path: K, getNew: T[K]): DeepIndex<T, K>
    set(getNew: T): T
    get<K extends AnyKey<T>>(path: Path): DeepIndex<T, K>
}


export class MyCursor<T extends EmptyInterface> extends MyCursor {
    apply<K extends AnyKey<T>>(path: K, getNew: (state: T[K]) => T[K]): DeepIndex<T, K>
    apply(getNew: (state: T) => T): T
    select<K extends AnyKey<T>>(path: K): MyCursor<DeepIndex<T, K>>
    set<K extends AnyKey<T>>(path: K, getNew: T[K]): DeepIndex<T, K>
    set(getNew: T): T
    get(): T
    get<K extends AnyKey<T>>(path: Path): DeepIndex<T, K>
}
