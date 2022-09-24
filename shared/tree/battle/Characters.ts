import type { CharacterStats, CharacterUid } from './Character'
import type { Effect } from './Effect'
import type { Orb } from './Orb'

export type StanceId = 'avoidant' | 'neutral' | 'aggressive'

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

export type CharacterId =
    | 'bloatDemon'
    | 'bogSpirit'
    | 'bookle'
    | 'bumbit'
    | 'frogKnight'
    | 'frogWizard'
    | 'gnomeHooligan'
    | 'goblinDragon'
    | 'greenJester'
    | 'jerry'
    | 'lichLord'
    | 'mushroomFarmer'
    | 'notoriousBEAN'
    | 'penguinKnight'
    | 'skeletonWarrior'
    | 'snacky'
    | 'theHatefly'
    | 'trioOfFools'
    | 'warhog'
    | 'wimpyGuard'
    | EnemyCharacterId

export type EnemyCharacterId =
    | 'skeletonWarrior'
    | 'matchaGelatinCube'
    | 'mimic'
    | 'orcWarrior'
    | 'bosshogJurgen'
    | 'toadmaw'
    | 'cultist'
    | 'halfdan'
