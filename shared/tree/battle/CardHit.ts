import type { CharacterUid } from './Character'

export interface CardHit {
    cardName: string
    attacker: CharacterUid
    damages: StatChangeMap
}

export type StatChangeMap = Record<CharacterUid, number>
export interface NetworkDOTData {
    damageMap: StatChangeMap
}
