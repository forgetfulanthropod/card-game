import type {
    CharacterClass,
    CharacterName,
    MoveMetaName,
    StanceName,
} from '..'
import type { Brandify } from './misc'

const Character = null
export type CharacterUid = string & Brandify
export type CharacterStats = Readonly<{
    name: CharacterName
    displayName: string
    class: CharacterClass
    isPc: boolean

    maxHealth: number // deprecated
    damage: number // deprecated

    constitution: number
    strength: number
    magic: number
    dexterity: number

    moves: CharacterMove[]
    learnableMoves?: LearnableCharacterMove[]
    level: number
    modifier: number
}> &
    Brandify
export type CharacterMove = Readonly<{
    name: string
    types: MoveMetaName[]
    damageRange?: number[]
}> &
    Brandify
type LearnableCharacterMove = CharacterMove &
    Readonly<{
        minLevel: number
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

export type StatsWithStance = CharacterStats &
    Readonly<{ stance: StanceName }> &
    Brandify
