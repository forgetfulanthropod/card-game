import type { CharacterUid } from '@'

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
