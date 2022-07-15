import type { CharacterUid } from './Character'
import type { CharacterMeta } from './Characters'

export interface CardHit {
    cardName: string
    attacker: CharacterUid
    damages: StatChangeMap
}

export type StatChangeMap = Record<CharacterUid, number>
export type StatChangesMap = Record<CharacterUid, Partial<CharacterMeta>>
export interface NetworkDOTData {
    damageMap: StatChangeMap
}
