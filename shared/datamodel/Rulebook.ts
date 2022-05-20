import type {
    CharacterName,
    DungeonRooms,
    EventTriggersMap,
    MoveMeta,
    MoveMetaName,
    StanceName,
    StanceStats,
} from '..'
import type { BlessingName, ItemName, LocationName, RecipeName } from '../names'
import type { Blessing } from './Blessing'
import type { CharacterStats } from './Character'
import type { Brandify, DungeonLevel, NpcLevelStatsMap } from './misc'

export type Rulebook = Readonly<{
    version: string
    savedAt?: string
    name: string
    shouldCoinFlipEveryRound: boolean
    characters: Record<CharacterName, CharacterStats>
    moveMetaMap: Record<MoveMetaName, MoveMeta>
    blessings: Record<BlessingName, Blessing>
    recipes: Record<
        RecipeName,
        { name: RecipeName; ingredients: ItemName[]; result: ItemName }
    >
    locations: Record<
        LocationName,
        {
            displayName: string
            name: LocationName
        }
    >
    npcLevelStatsMap: NpcLevelStatsMap
    dungeonLevels: DungeonLevel[]
    dungeonRooms: DungeonRooms
    items: Record<
        ItemName,
        {
            name: ItemName
            displayName: string
            description: string
        }
    >
    stanceTypeMetaMap: Record<StanceName, StanceStats>
    levelThresholds: Record<number, number>
    // npcNames: CharacterName[]
    specialDoorsMap: Record<string, any> // eslint-disable-line @typescript-eslint/no-explicit-any
    eventTriggersMap: EventTriggersMap
}> &
    Brandify
