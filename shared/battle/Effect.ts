import type { CharacterUid } from '..'

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
