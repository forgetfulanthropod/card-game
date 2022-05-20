import type { CharacterMove, CharacterUid, MoveMetaName } from '../index'
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
