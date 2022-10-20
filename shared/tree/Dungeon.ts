import type { Brandify } from '@misc'
import type { DungeonName, EnemyCharacterId } from './battle'

export type DungeonLevel = Readonly<DungeonLevelI> & Brandify
interface DungeonLevelI {
    name: DungeonName
    num: number
    modifier: number
}

export type DungeonRoomMap = Record<DungeonName, DungeonRoom[]>

export type DungeonRoom = ReadonlyArray<{
    id: EnemyCharacterId | 'REST_SITE'
    level: string | number
    boss?: true
}>

export const TOTAL_ROOMS_PER_RUN = 6
