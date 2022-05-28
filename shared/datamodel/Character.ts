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
    magic: number
    /** base block */
    dexterity: number
}> &
    Brandify

/** Result of applying effects to character */
export type CalculatedCharacterStats = Readonly<{
    isSkipped: boolean
    constitution: number
    strength: number
    magic: number
    dexterity: number
}> &
    Brandify

export type OwnedCharacterStats = CharacterStats &
    Readonly<{
        uid: string
        tokenId: string
        nftName: string
    }> &
    Brandify

export type OwnedCharacterStatsMap = Record<CharacterUid, OwnedCharacterStats>
