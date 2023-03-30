import type { Brandify } from '@misc'
import { NpcCommandId } from './Card'
import type {
    CharacterClass,
    CharacterId,
    NonPlayerCharacterId,
    PlayerCharacterId,
    StanceId,
} from './Characters'

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
    | 'damageDealMultiplicand'
    | 'damageDealAddend'
    | 'damageTakeMultiplicand'
    | 'damageTakeAddend'

export type StatModifiers = Partial<
    Pick<CalculatedCharacterStats, ModifiableStatName>
>

export type StatModifierExpiration = 'turn' | 'room' | 'run'
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

export type PlayerCharacterStats = Readonly<
    CharacterStats & { id: PlayerCharacterId; skin?: any }
>

export type NonPlayerCharacterStats = Readonly<
    CharacterStats & { id: NonPlayerCharacterId }
>

export type BaseHealth = number | `${number}-${number}` | `>${number}`
export type EnemyDefinition = {
    // displayName: string
    // level: number | string | null
    // id: string
    constitution: BaseHealth
    strength: number
    defense: number
    magic: number
    level: number | string
    // TODO: rename to commands
    moves: readonly (NpcCommandId | null)[]
}
type Level = string
export type NpcStatsMapByLevel = Record<
    NonPlayerCharacterId,
    Record<Level, EnemyDefinition>
>

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
        // tokenId: string
        // nftName: string
    }> &
    Brandify

export type OwnedCharacterStatsMap = Record<
    PlayerCharacterId,
    OwnedCharacterStats
>
