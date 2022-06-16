import type { Brandify } from '@misc'
import type {
    CharacterId,
    StanceId,
    StanceStats,
    CharacterStats,
} from './battle'
import type { DungeonLevel, DungeonRoomMap } from './Dungeon'

export type Rulebook = Readonly<{
    version: string
    savedAt?: string
    name: string
    characters: Record<CharacterId, CharacterStats>
    dungeonLevels: DungeonLevel[]
    dungeonRooms: DungeonRoomMap
    stanceTypeMetaMap: Record<StanceId, StanceStats>
}> &
    Brandify
