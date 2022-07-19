import type { TargetType } from './Card'
import type { CharacterUid } from './Character'
import type { CharacterMeta } from './Characters'

export interface CardHit {
    cardName: string
    characterUid: CharacterUid
    targetType: TargetType
    targetUids: CharacterUid[]
    // damages: StatChangeMap
}

export type StatChangeMap = Record<CharacterUid, number>
export type StatChangesMap = Record<
    CharacterUid,
    Partial<CharacterMeta & { wait: boolean }>
>
export interface NetworkDOTData {
    damageMap: StatChangeMap
}
