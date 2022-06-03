import type { DungeonName, EnemyCharacterName } from '@'

export type DungeonRoomMap = Record<DungeonName, DungeonRoom[]>

export type DungeonRoom = ReadonlyArray<{
    name: EnemyCharacterName
    level: string | number
}>
