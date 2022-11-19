import type { Brandify } from '@misc'
import type { CharacterClass, CharacterId, StanceId } from './Characters'

export type CharacterAbility = {
    displayName: string
    actions: string
    type: 'passive' | 'oneTime'
    description: string
}

export type CharacterUid = string & Brandify
export type ModifiableStatName =
    | 'strength'
    | 'magic'
    | 'defense'
    | 'constitution'

export type StatModifiers = Partial<Pick<CharacterStats, ModifiableStatName>>

export type StatModifierExpiration = 'round' | 'room' | 'run'
export type StatModifiersMap = Record<StatModifierExpiration, StatModifiers>

export type CharacterStats = Readonly<{
    /** TODO: rename this to ID  */
    id: CharacterId
    displayName: string
    class: CharacterClass
    isPc: boolean
    /** base health */
    constitution: number
    /** base attack */
    strength: number
    /** base magic */
    magic: number
    /** base block */
    defense: number
    // abilities: CharacterAbility[]
}> &
    Brandify

/** Result of applying effects to character */
export interface CalculatedCharacterStats {
    isSkipped: boolean
    block: number
    constitution: number
    strength: number
    magic: number
    defense: number
    damageDealMultiplicand: number
    damageDealAddend: number
    damageTakeMultiplicand: number
    damageTakeAddend: number
    blockMultiplier: number
    health: number
    stance: StanceId
}

export type OwnedCharacterStats = CharacterStats &
    Readonly<{
        uid: string
        tokenId: string
        nftName: string
    }> &
    Brandify

export type OwnedCharacterStatsMap = Record<CharacterUid, OwnedCharacterStats>
