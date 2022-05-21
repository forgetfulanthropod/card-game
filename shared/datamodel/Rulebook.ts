import type { CharacterStats } from './Character'
import type { Brandify, DungeonLevel, NpcLevelStatsMap } from './misc'
import type {
    CharacterName,
    DungeonRooms,
    EventTriggersMap,
    StanceName,
    StanceStats,
} from '@'

export type Rulebook = Readonly<{
    version: string
    savedAt?: string
    name: string
    shouldCoinFlipEveryRound: boolean
    characters: Record<CharacterName, CharacterStats>
    npcLevelStatsMap: NpcLevelStatsMap
    dungeonLevels: DungeonLevel[]
    dungeonRooms: DungeonRooms
    stanceTypeMetaMap: Record<StanceName, StanceStats>
    levelThresholds: Record<number, number>
    // npcNames: CharacterName[]
    specialDoorsMap: Record<string, any> // eslint-disable-line @typescript-eslint/no-explicit-any
    eventTriggersMap: EventTriggersMap
}> &
    Brandify
