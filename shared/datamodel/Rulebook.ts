import type { CharacterStats } from './Character'
import type { Brandify, DungeonLevel } from './misc'
import type { CharacterName, StanceName, StanceStats } from '@'

export type Rulebook = Readonly<{
    version: string
    savedAt?: string
    name: string
    characters: Record<CharacterName, CharacterStats>
    dungeonLevels: DungeonLevel[]
    stanceTypeMetaMap: Record<StanceName, StanceStats>
}> &
    Brandify
