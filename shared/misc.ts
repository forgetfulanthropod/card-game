import type { SCursor } from 'sbaobab'
import type { EntryScene, BattleScene } from './tree'

export type BattleCursor = SCursor<BattleScene>

/** Intersecting a type with this makes the type not get aliased to its definition by typescript & vscode. Useful for e.g. auto-refactors and function return types. */
export type Brandify = {
    ___?: undefined
}

export type SceneHas = Readonly<{
    id: SceneId
}> &
    Brandify

export type SceneId = 'entry' | 'battle'
export type Scene = BattleScene | EntryScene

export type NestedKeys<T> = T extends object
    ? { [K in keyof T]-?: K | NestedKeys<T[K]> }[keyof T]
    : never
