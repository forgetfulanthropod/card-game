import type { CharacterStats } from './Character'
import type { Brandify, DungeonLevel } from './misc'
import type { DungeonRoomMap } from './DungeonRoom'
import type { CharacterId, StanceId, StanceStats } from '@'

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
