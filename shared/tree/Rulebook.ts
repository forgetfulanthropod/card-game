import type { Brandify } from '@misc'
import type {
    CharacterId,
    StanceId,
    StanceStats,
    CharacterStats,
} from './battle'
import type { DungeonLevel, DungeonRoomMap, DungeonRoomMaps } from './Dungeon'

export type Rulebook = Readonly<{
    version: string
    savedAt?: string
    name: string
    characters: Record<CharacterId, CharacterStats>
    dungeonLevels: DungeonLevel[]
    dungeonRooms: DungeonRoomMaps
    stanceTypeMetaMap: Record<StanceId, StanceStats>
}> &
    Brandify
