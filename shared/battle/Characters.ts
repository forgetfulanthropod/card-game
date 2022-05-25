import type { Effect } from './Effect'
import type { Orb } from './Orb'
import type { CharacterName, CharacterStats, CharacterUid, StanceName } from '@'

export type Characters = Record<CharacterUid, CharacterMeta>

export interface CharacterMeta extends CharacterStats {
    name: CharacterName
    uid: CharacterUid
    isPc: boolean
    hasMoved: boolean
    health: number
    block: number
    experience: number
    x: number
    y: number
    screenX: number
    screenY: number
    stance: StanceName
    effects: Effect[]
    orbs: Orb[]
}
export type CharacterClass = 'cleric' | 'knight' | 'wizard' | 'bard' | 'rogue'
