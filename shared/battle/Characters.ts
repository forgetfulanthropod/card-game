import type { Effect } from './Effect'
import type { Orb } from './Orb'
import type { CharacterName, CharacterStats, CharacterUid, StanceName } from '@'

export type Characters = Record<CharacterUid, CharacterMeta>

/** TODO: simplify CharacterMeta, CharacterStats, OwnedCharacterStats,   */
export interface CharacterMeta extends CharacterStats {
    name: CharacterName
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
    stance: StanceName
    effects: Effect[]
    orbs: Orb[]
}
export type CharacterClass = 'cleric' | 'knight' | 'wizard' | 'bard' | 'rogue'
