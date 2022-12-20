import type {
    CalculatedCharacterStats,
    CharacterStats,
    CharacterUid,
    StatModifiers,
    StatModifiersMap,
} from './Character'
import type { Effect } from './Effect'
import type { Orb } from './Orb'

export type StanceId = 'avoidant' | 'neutral' | 'aggressive'

export type Characters = Record<CharacterUid, CharacterMeta>
export type EnemyCharacters = Record<CharacterUid, EnemyCharacterMeta>

/** TODO: simplify CharacterMeta, CharacterStats, OwnedCharacterStats,   */
export type EnemyCharacterMeta = Omit<
    CharacterMeta,
    'stance' | 'class' | 'stanceInPrevTurn'
> & {
    id: NonPlayerCharacterId
    level: string | number
    calculatedStats?: CalculatedCharacterStats
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
    stanceInPrevTurn: StanceId
    effects: Effect[]
    orbs: Orb[]
    statModifiersMap: StatModifiersMap
    calculatedStats: CalculatedCharacterStats
}
export type CharacterClass = 'cleric' | 'knight' | 'wizard' | 'bard' | 'rogue'

export type PlayerCharacterId =
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
    | 'matchaGelatinCube'
    | 'mushroomFarmer'
    | 'notoriousBEAN'
    | 'orcWarrior'
    | 'penguinKnight'
    | 'skeletonWarrior'
    | 'snacky'
    | 'theHatefly'
    | 'trioOfFools'
    | 'warhog'
    | 'wimpyGuard'

/**
 * to make a player character with same Id, just copy the ID over,
 * duplicate iDs are ok, so vice versa too!
 */
export type NonPlayerCharacterId =
    | 'bosshogJurgen'
    | 'cultist'
    | 'gnomeBandit'
    | 'gnomeBigBomber'
    | 'gnomeHooligan'
    | 'gnomeProspector'
    | 'groghog'
    | 'halfdan'
    | 'matchaGelatinCube'
    | 'mimic'
    | 'orcWarrior'
    | 'plaguehog'
    | 'skeletonWarrior'
    | 'toadmaw'
    | 'warhog'
    | 'warhogRaider'

export type CharacterId = PlayerCharacterId | NonPlayerCharacterId
