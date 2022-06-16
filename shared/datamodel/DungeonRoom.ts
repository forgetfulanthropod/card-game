import type { DungeonName, EnemyCharacterId } from '@'

export type DungeonRoomMap = Record<DungeonName, DungeonRoom[]>

export type DungeonRoom = ReadonlyArray<{
    id: EnemyCharacterId
    level: string | number
}>
