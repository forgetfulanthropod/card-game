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
    | `gnomeBomb(${number})`
    | `bucketOfBangSnaps(${number})`
    | `fireCracker(${number})`
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
    | 'ancientStrike'
    | 'attack4'
    | 'basicAttack'
    | 'block'
    | 'chomp'
    | 'evisceratingSweep'
    | 'grudge'
    | 'gnomeBomb'
    | 'bucketOfBangSnaps'
    | 'fireCracker'
    | 'hansBuffBlock'
    | 'hansCurse'
    | 'hansGuards'
    | 'hansMagicMissile'
    | 'infectiousBite'
    | 'itchyOozeSpecial'
    | 'jab'
    | 'jurgenBellyFlop'
    | 'jurgenRollAround'
    | 'jurgenRollAround'
    | 'jurgenSitUpon'
    | 'jurgenStampSnort'
    | 'matchaMadness'
    | 'matchaMash'
    | 'matchaMeld'
    | 'mimicAttack'
    | 'infectiousBite'
    | 'grudge'
    | 'passiveBlockCmd'
    | 'rest'
    | 'rustyPokeHigh'
    | 'rustyPokeLow'
    | 'slash'
    | 'strike'
    | 'swordWack'
    | AliasedCommandId
export type CommandId =
    | NpcCommandId
    | CardId
    /** For enqueueAction() */
    | `generated-command-${number}`
    /** For test suites */
    | 'unknown'

export type CardId =
    // | 'arcanePower'
    | 'ancientVerse'
    | 'basicAttackBard'
    | 'basicAttackKnight'
    | 'basicAttackCleric'
    | 'basicAttackWizard'
    | 'basicAttackRogue'
    | 'berserk'
    | 'bless'
    | 'blockCleric'
    | 'blockKnight'
    | 'blockWizard'
    | 'blockRogue'
    | 'bodySlam'
    | 'chainLightning'
    | 'charge'
    | 'dutifulStab'
    | 'fireball'
    | 'flashBang'
    | 'guidingBolt'
    | 'gnomeBomb'
    | 'helpingHand'
    | 'jab'
    | 'trance'
    | 'magicRitual'
    | 'mantraOfPatience'
    | 'momentOfClarity'
    | 'orbOfFrost'
    | 'orbOfHolyLight'
    | 'orbOfLightning'
    | 'orbOfProtection'
    | 'parry'
    | 'patientAmbush'
    | 'poisonedBlade'
    // | 'prayerOfGoodFortune'
    | 'psychicWarfare'
    | 'scatterBrained'
    | 'shieldOfLight'
    | 'smite'
    | 'spellBook'
    | 'strike'
    | 'stab'
    | 'sweepTheLeg'
    | 'swordSlash'
    | 'leadRazor'
    | 'testudoFormation'
    | 'zap'
export type BasicTargetType =
    | 'friends'
    | 'enemies'
    | 'allFriends'
    | 'allEnemies'
    | 'self'
    | 'card'
    | 'cardAttack'
    | 'cardEnchantment'
    | 'orb'
export type TargetType = BasicTargetType
// | Array<
//       | BasicTargetType
//       | {
//             type: BasicTargetType
//             constraint?: {
//                 key: string
//                 comparator: '<=' | '>='
//                 value: number
//             }
//         }
//   >

export type Pile = Record<CardUid, Card>
export type Piles = Record<PileId, Pile>

export const NUM_DRAFT_CARD_OPTIONS = 3
