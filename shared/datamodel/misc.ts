import type { BattleScene, DungeonName, EntryScene } from '@'

export type CardUid = string & Brandify
/** Intersecting a type with this makes the type not get aliased to its definition by typescript & vscode. Useful for e.g. auto-refactors and function return types. */

export type Brandify = {
    ___?: undefined
}

export type SceneHas = Readonly<{
    name: SceneType
}> &
    Brandify

export type SceneType = 'entry' | 'battle'
export type Scene = BattleScene | EntryScene

export type DungeonLevel = Readonly<DungeonLevelI> & Brandify
interface DungeonLevelI {
    name: DungeonName
    num: number
    modifier: number
}
