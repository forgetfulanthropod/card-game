import type {
    CardUid,
    CharacterMove,
    CharacterName,
    CharacterStats,
    CharacterUid,
    DungeonName,
    PileId,
    SceneHas,
} from '.'
import type { SpecialDoorName } from './SpecialDoorName'

export type Pile = Record<CardUid, Card>
export type Cards = Record<PileId, Pile>
export interface BattleScene extends SceneHas {
    username: string
    name: 'battle'
    dungeonName: DungeonName
    state: BattleWinState
    playerStarts: boolean
    isPlayerTurn: boolean
    allCharacters: Characters
    cards: Cards
    energy: number
    selectedCharacter: CharacterUid
    selectedMove: CharacterMove
    isBasicLoaded: boolean
    isDeluxeLoaded: boolean
    turnCount: number
    doors: { options: SpecialDoorName[]; descriptions: string[] }
    roomsPassed: number
    selectedTargets: CharacterUid[]
    // loot: Record<ItemUid, ItemName>
}
type BattleWinState = 'not started' | 'in battle' | 'won' | 'lost'

export interface MoveMeta {
    name: MoveMetaName
    numTargets: number | number[]
    multiplier?: number
    multiplierRange?: [number, number]
    multipliers?: number[] // number of targets varying damage
    effectMultipliers?: number[] // for damage over time
    defaultSpriteUrl?: string
    isSpecial?: boolean
}

export type EffectType = 'DOT1' | 'DOT2' | 'Debilitated'
export interface Effect {
    type: EffectType
    remainingRounds: number
    attackMultiplicand?: number
    attackAddend?: number
    blockMultiplicand?: number
    blockAddend?: number
    damagesByRound?: number[]
    dealer?: CharacterUid
}

export type OrbType = 'lightning' | 'protection'
export interface Orb {
    type: OrbType
    remainingCount: number
}

export type CardType = 'attack' | 'defense' | 'enchantment' | 'utility'

export type CardId =
    | 'shieldOfLight'
    | 'shield'
    | 'sweepTheLeg'
    | 'bodySlam'
    | 'jab'
    | 'strike'
    | 'orbOfLightning'
    | 'orbOfProtection'

export type CharacterClass = 'cleric' | 'knight' | 'wizard' | 'bard' | 'rogue'

export type Card = {
    name: string
    energy: number
    id: CardId
    targetNum: number
    targetType: 'friends' | 'enemies' | 'self'
    actions: string
    type: CardType
    characterClass: CharacterClass
    // dynamic
    characterUid: CharacterUid
    explanation: string
}

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

export type Characters = Record<CharacterUid, CharacterMeta>

export type StanceName = 'defensive' | 'neutral' | 'aggressive'
export type StanceMultiplier = 0.75 | 1 | 1.25
export type StanceStats = {
    name: StanceName
    attackMultiplier: StanceMultiplier
    defenseMultiplier: StanceMultiplier
    targetLikelihood: 0 | 1 | 2
}
export type MoveMetaName =
    | 'BA'
    | 'SL'
    | 'SP'
    | 'ROD1'
    | 'ROD2'
    | 'ROD3'
    | 'DOT1'
    | 'DOT2'
    | 'ST'
    | 'INHSO'
    | 'DC4A'
    | 'MIM'
    | 'DBF1'
    | 'DBF2'
    | 'BLK'
export type AttackData = {
    attacker: CharacterMeta
    defenders: CharacterMeta[]
    move: CharacterMove
}
export interface NetworkAttackData {
    moveName: string
    defenderUids: CharacterUid[]
    attackerUid: CharacterUid
    attackerIsPc: boolean
    damageKVs: {
        key: CharacterUid
        damage: number
    }[]
}

export type DamageMap = Record<CharacterUid, number>
export interface NetworkDOTData {
    damageMap: DamageMap
}
