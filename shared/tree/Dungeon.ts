import type { Brandify } from '@misc'
import type { DungeonName, NonPlayerCharacterId } from './battle'

export type DungeonLevel = Readonly<DungeonLevelI> & Brandify
interface DungeonLevelI {
    name: DungeonName
    num: number
    modifier: number
}

export type RoomUid = string

export type DungeonRoomMaps = Record<DungeonName, DungeonRoomMap>

export type DungeonRoomMap = Record<RoomUid, DungeonRoom>

export type RoomCategoryId =
    | 'events'
    | 'tierOne'
    | 'tierTwo'
    | 'tierThree'
    | 'bosses'

export type DungeonRoom = {
    uid: RoomUid
    enemies: RoomEnemies
    edges: [RoomUid, RoomUid, RoomUid, RoomUid]
    category?: RoomCategoryId
}

export type RoomEnemies = {
    id: NonPlayerCharacterId | 'REST_SITE'
    level: string | number
    boss?: true
}[]
