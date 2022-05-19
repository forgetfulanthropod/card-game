import type { CharacterMove, CharacterUid } from '..'
import type { CharacterMeta } from './Characters'

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
