import type { CharacterName, DungeonName } from '@'

export type DungeonRoomMap = Record<DungeonName, DungeonRoom[]>

export type DungeonRoom = ReadonlyArray<{
    name: CharacterName
    level: string | number | null
}>
