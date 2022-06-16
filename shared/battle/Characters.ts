import type { Effect } from './Effect'
import type { Orb } from './Orb'
import type {
    CharacterId as CharacterId,
    CharacterStats,
    CharacterUid,
    EnemyCharacterId,
    StanceId,
} from '@'

export type Characters = Record<CharacterUid, CharacterMeta>
export type EnemyCharacters = Record<CharacterUid, EnemyCharacterMeta>

/** TODO: simplify CharacterMeta, CharacterStats, OwnedCharacterStats,   */
export type EnemyCharacterMeta = Omit<CharacterMeta, 'stance' | 'class'> & {
    id: EnemyCharacterId
    level: string | number
}
export interface CharacterMeta extends CharacterStats {
    id: CharacterId
    uid: CharacterUid
    isPc: boolean
    /** TODO: remove */
    hasMoved: boolean
    health: number
    block: number
    /** TODO: client should handle positioning  */
    x: number
    y: number
    screenX: number
    screenY: number
    stance: StanceId
    effects: Effect[]
    orbs: Orb[]
}
export type CharacterClass = 'cleric' | 'knight' | 'wizard' | 'bard' | 'rogue'
