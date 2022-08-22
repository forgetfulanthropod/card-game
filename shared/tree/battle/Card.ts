import type { Brandify } from '@misc'
import type { CharacterUid } from './Character'
import type { CharacterClass } from './Characters'

export type CardUid = string & Brandify

export type PileId = 'draw' | 'hand' | 'discard' | 'removedRoom' | 'removedRun'

export type DSLString = string & Brandify

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

export type NpcCommandId =
    | 'swordWack'
    | 'jab'
    | 'strike'
    | 'slash'
    | 'jurgenRollAround'
    | 'mimicAttack'
    | 'rustyPokeHigh'
    | 'rustyPokeLow'
    | 'block'
    | 'basicAttack'
    | 'chomp'
    | 'itchyOozeSpecial'
    | 'jurgenBellyFlop'
    | 'jurgenStampSnort'
    | 'jurgenRollAround'
    | 'jurgenSitUpon'
    | 'attack4'
    | 'rest'
    | 'matchaMash'
    | 'matchaMadness'
    | 'matchaMeld'
    | 'evisceratingSweep'
    | 'passiveBlockCmd'
    | 'ancientStrike'
    | 'hansBuffBlock'
    | 'hansMagicMissile'
    | 'hansGuards'
    | 'hansCurse'
    | AliasedCommandId
export type CommandId =
    | NpcCommandId
    | CardId
    /** For enqueueAction() */
    | `generated-command-${number}`
    /** For test suites */
    | 'unknown'

export type CardId =
    | 'arcanePower'
    | 'basicAttackBard'
    | 'basicAttackCleric'
    | 'basicAttackCleric'
    | 'basicAttackKnight'
    | 'basicAttackWizard'
    | 'basicAttackWizard'
    | 'bless'
    | 'blockCleric'
    | 'blockKnight'
    | 'blockWizard'
    | 'bodySlam'
    | 'chainLightning'
    | 'charge'
    | 'dutifulStab'
    | 'fireball'
    | 'guidingBolt'
    | 'gnomeBomb'
    | 'helpingHand'
    | 'jab'
    | 'magicalStorm'
    | 'magicRitual'
    | 'mantraOfPatience'
    | 'orbOfFrost'
    | 'orbOfHolyLight'
    | 'orbOfLightning'
    | 'orbOfProtection'
    | 'parry'
    | 'prayerOfGoodFortune'
    | 'psychicWarfare'
    | 'scatterBrained'
    | 'shield'
    | 'shieldOfLight'
    | 'smite'
    | 'spellBook'
    | 'strike'
    | 'sweepTheLeg'
    | 'swordSlash'
    | 'TEST_turnStartEffects'
    | 'testudoFormation'
export type BasicTargetType =
    | 'friends'
    | 'enemies'
    | 'allEnemies'
    | 'self'
    | 'card'
    | 'cardAttack'
    | 'cardEnchantment'
    | 'orb'
export type TargetType =
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
export type Piles = Record<PileId, Pile>
