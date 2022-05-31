import type { Brandify } from './misc'
import type { CharacterClass, CharacterName } from '@'

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
    dexterity: number
}> &
    Brandify

/** Result of applying effects to character */
export interface CalculatedCharacterStats {
    isSkipped: boolean
    block: number
    constitution: number
    strength: number
    wisdom: number
    dexterity: number
    damageTakeMultiplier: number
    damageTakeAddend: number
    blockMultiplier: number
}

export type OwnedCharacterStats = CharacterStats &
    Readonly<{
        uid: string
        tokenId: string
        nftName: string
    }> &
    Brandify

export type OwnedCharacterStatsMap = Record<CharacterUid, OwnedCharacterStats>
