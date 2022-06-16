import type { Brandify } from './misc'
import type { CharacterClass, CharacterName } from '@'

export type CharacterAbility = {
    displayName: string
    actions: string
    type: 'passive' | 'oneTime'
    description: string
}

export type CharacterUid = string & Brandify
export type CharacterStats = Readonly<{
    /** TODO: rename this to ID  */
    name: CharacterName
    displayName: string
    class: CharacterClass
    isPc: boolean
    /** base health */
    constitution: number
    /** base attack */
    strength: number
    /** base magic */
    wisdom: number
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
    wisdom: number
    defense: number
    damageTakeMultiplier: number
    damageTakeAddend: number
    blockMultiplier: number
    health: number
}

export type OwnedCharacterStats = CharacterStats &
    Readonly<{
        uid: string
        tokenId: string
        nftName: string
    }> &
    Brandify

export type OwnedCharacterStatsMap = Record<CharacterUid, OwnedCharacterStats>
