import type {
    BattleScene,
    CharacterName,
    DungeonName,
    EntryScene,
} from '../index'

export type CardUid = string & Brandify
/** Intersecting a type with this makes the type not get aliased to its definition by typescript & vscode. Useful for e.g. auto-refactors and function return types. */

export type Brandify = {
    ___?: undefined
}

export type SceneHas = Readonly<{
    name: SceneType
}> &
    Brandify

export type SceneType = 'map' | 'craft' | 'entry' | 'battle'
export type Scene = BattleScene | EntryScene

export type Door = 'A' | 'B' | 'C' | 'D' | 'random'

export type DungeonLevel = Readonly<DungeonLevelI> & Brandify
interface DungeonLevelI {
    name: DungeonName
    num: number
    modifier: number
}

export type TargetType = 'party' | 'enemies'

export type NpcLevelStatsMap = Readonly<
    Partial<
        Record<
            CharacterName,
            Record<number, { maxHealth: number; damage: number }>
        >
    >
> &
    Brandify
