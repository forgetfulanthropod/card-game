import type { CharacterClass } from './Characters'
import type { CardUid, CharacterUid, PileId } from '@'

type CardAction = string //  regex(/(wordA|wordB|wordC)+$/)

export interface Command extends CommandDefinition {
    characterUid: CharacterUid
}

type AliasedCommandId =
    | `startlingSpook(${number},${number})`
    | `surpriseAllergy(${number},${number})`
    | `itchyOoze(${number})`
    | `infectiousBite(${number})`
    | `engulf(${number})`
    | `meatyCharge(${number})`
    | `bellowAndSing(${number},${number})`
    | `screamAndCharge(${number},${number})`

export interface CommandDefinition {
    id: CommandId
    name: string
    actions: CardAction
    targetNum: number
    targetType: TargetType
}

/** Matches interface Command! */
export interface Card extends CardDefinition {
    characterUid: CharacterUid
    uid: CardUid
    explanation: string
}

// CardBase

export interface CardDefinition extends CommandDefinition {
    id: CardId
    energy: number
    type: CardType
    characterClass: CharacterClass
}

export type CardType = 'attack' | 'defense' | 'enchantment' | 'utility'

export type NpcCommandId = 'swordWack' | 'jab' | 'strike' | AliasedCommandId
export type CommandId = NpcCommandId | CardId

export type CardId =
    | 'shieldOfLight'
    | 'shield'
    | 'sweepTheLeg'
    | 'bodySlam'
    | 'jab'
    | 'strike'
    | 'orbOfLightning'
    | 'orbOfProtection'
    | 'basicMagicAttackWizard'
    | 'basicMagicAttackCleric'
    | 'magicRitual'
    | 'chainLightning'
    | 'spellBook'
    | 'fireball'
    | 'arcanePower'
    | 'scatterBrained'
    | 'magicalStorm'
    | 'orbOfFrost'
    | 'basicAttackCleric'
    | 'basicAttackKnight'
    | 'blockCleric'
    | 'blockKnight'
    | 'blockWizard'
    | 'swordSlash'
    | 'dutifulStab'
    | 'charge'
    | 'tetsudoFormation'
    | 'guidingBolt'
    | 'smite'
    | 'bless'
    | 'prayerOfGoodFortune'
    | 'orbOfHolyLight'
    | 'mantraOfPatience'
    | 'helpingHand'
type BasicTargetType =
    | 'friends'
    | 'enemies'
    | 'self'
    | 'card'
    | 'cardAttack'
    | 'cardEnchantment'
    | 'orb'
type TargetType =
    | BasicTargetType
    | Array<
          | BasicTargetType
          | {
                type: BasicTargetType
                constraint?: {
                    key: string
                    comparator: '<=' | '>='
                    value: number
                }
            }
      >

export type Pile = Record<CardUid, Card>
export type Cards = Record<PileId, Pile>
