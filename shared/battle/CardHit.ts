import type { CharacterUid } from '@'

export interface CardHit {
    cardName: string
    attacker: CharacterUid
    damages: DamageMap
}

export type DamageMap = Record<CharacterUid, number>
export interface NetworkDOTData {
    damageMap: DamageMap
}
