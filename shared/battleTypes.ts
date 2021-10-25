import type { CharacterMove, CharacterName, CharacterStats, CharacterUid, DungeonName, SceneHas } from '@shared/index'

import type { SpecialDoorName } from './SpecialDoorName'

export interface BattleScene extends SceneHas {
    name: 'battle'
    dungeonName: DungeonName
    state: BattleWinState
    isPlayerTurn: boolean
    allCharacters: Record<CharacterUid, CharacterMeta>
    selectedCharacter: CharacterUid
    selectedMove: CharacterMove
    isBasicLoaded: boolean
    isDeluxeLoaded: boolean
    turnCount: number
    doors: { options: SpecialDoorName[], descriptions: string[] }
    roomsPassed: number
    // loot: Record<ItemUid, ItemName>
}
export type BattleWinState = 'not started' | 'in battle' | 'won' | 'lost'

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

export type EffectType = 'DOT1' | 'DOT2'
export interface Effect {
    type: EffectType
    remainingRounds: number
    damagesByRound: number[]
    dealer?: CharacterMeta
}

export interface CharacterMeta extends CharacterStats {
    name: CharacterName
    uid: CharacterUid
    isPc: boolean
    hasMoved: boolean
    health: number
    x: number
    y: number
    screenX: number
    screenY: number
    stance: StanceName
    effects: Effect[]
}

export type StanceName = 'defensive' | 'neutral' | 'aggressive'
export type StanceMultiplier = .75 | 1 | 1.25
export type StanceStats = {
    name: StanceName
    attackMultiplier: StanceMultiplier
    defenseMultiplier: StanceMultiplier
    targetLikelihood: 0 | 1 | 2
}
export type MoveMetaName = 'BA' | 'SL' | 'SP' | 'ROD1' | 'ROD2' | 'ROD3' | 'DOT1' | 'DOT2' | 'ST' | 'INHSO' | 'DC4A' | 'MIM' | 'DBF1' | 'DBF2' | 'BLK'
export type AttackData = {
    attacker: CharacterMeta
    defenders: CharacterMeta[]
    move: CharacterMove
}
export interface NetworkAttackData {
    attackerIsPc: boolean
    move: CharacterMove
    attacker: CharacterUid
    defenders: CharacterUid[]
    damageMap: {
        key: CharacterUid
        damage: number
    }[]
}
