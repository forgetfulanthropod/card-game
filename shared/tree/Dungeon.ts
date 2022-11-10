import type { Brandify } from '@misc'
import type { DungeonName, EnemyCharacterId } from './battle'

export type DungeonLevel = Readonly<DungeonLevelI> & Brandify
interface DungeonLevelI {
    name: DungeonName
    num: number
    modifier: number
}

export type RoomUid = string

export type DungeonRoomMaps = Record<DungeonName, DungeonRoomMap>

export type DungeonRoomMap = Record<RoomUid, DungeonRoom>

export type DungeonRoom = {
    uid: RoomUid
    enemies: RoomEnemies
    edges: [RoomUid, RoomUid, RoomUid, RoomUid]
}

export type RoomEnemies = ReadonlyArray<{
    id: EnemyCharacterId | 'REST_SITE'
    level: string | number
    boss?: true
}>

export const TOTAL_ROOMS_PER_RUN = 6
