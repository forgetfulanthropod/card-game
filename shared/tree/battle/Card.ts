import type { Brandify } from '@misc'
import { CommandOutcome } from './BattleScene'
import type { CharacterUid } from './Character'
import type { CharacterClass, CharacterId } from './Characters'

export type CardUid = string & Brandify

export type PileId = 'draw' | 'hand' | 'discard' | 'removedRoom' | 'removedRun'

export type DSLString = string & Brandify

export type CardAction = string //  regex(/(wordA|wordB|wordC)+$/)

export interface Command extends CommandDefinition {
    characterUid: CharacterUid
}

type AliasedCommandId =
    | `startlingSpook(${number},${number})`
    | `surpriseAllergy(${number},${number})`
    | `itchyOoze(${number})`
    | `engulf(${number})`
    // | `gnomeBomb(${number})`
    | `bucketOfBangSnaps(${number})`
    | `fireCracker(${number})`
    | `meatyCharge(${number})`
    | `bellowAndSing(${number},${number})`
    | `screamAndCharge(${number},${number})`

export interface NpcCommandDefinition extends CommandDefinition {
    id: NpcCommandId
}
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
    outcomes?: Record<string, CommandOutcome>
}

export interface CardDefinition extends CommandDefinition {
    id: CardId
    energy: number
    type: CardType
    characterClass: CharacterClass | CharacterId
    on?: {
        draw?: CardAction
        discard?: CardAction
        remove?: CardAction
    }
}

export type CardType = 'attack' | 'defense' | 'enchantment' | 'utility'

export type NpcCommandId =
    | 'ancientStrike'
    | 'basicAttack'
    | 'bigBelly'
    | 'bigBomb1'
    | 'bigBomb2'
    | 'block'
    | 'brimbone'
    | 'bucketOfBangSnaps'
    | 'chomp'
    | 'demolitionCharge'
    | 'evisceratingSweep'
    | 'fire'
    | 'fireCracker'
    | 'gnomeBomb'
    | 'grudge'
    | 'hansBuffBlock'
    | 'hansCurse'
    | 'hansGuards'
    | 'hansMagicMissile'
    | 'hypnosis'
    | 'itchyOozeSpecial'
    | 'jab'
    | 'jurgenBellyFlop'
    | 'jurgenRollAround'
    | 'jurgenSitUpon'
    | 'jurgenStampSnort'
    | 'matchaMadness'
    | 'matchaMash'
    | 'matchaMeld'
    | 'mimicAttack'
    | 'roadClosure'
    | 'snowFort'
    | 'commonCold'
    | 'parasiticNibble'
    | 'passiveBlockCmd'
    | 'psychicBolt'
    | 'quickNap'
    | 'rest'
    | 'rustyPokeHigh'
    | 'rustyPokeLow'
    | 'slash'
    | 'snortinTime'
    | 'spiritQuest'
    | 'strike'
    | 'surpriseAllergy'
    | 'swordWack'
    | 'tummySlam'
    | 'violentSneeze'
    | 'yodel'
    | 'mimicInfectiousBite'
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
    // | 'beVerySmall'
    // | 'catchTheKnife'
    // | 'coldTrance'
    // | 'constraint'
    // | 'cowardlyTactics'
    // | 'exponentialIllness'
    // | 'flashbang'
    // | 'prayerOfGoodFortune'
    // | 'retreatToTheShadows'
    // | 'songOfCourage'
    // | 'throwingKnife'
    // | 'twistTheKnife'
    | 'ancientVerse'
    | 'barterWithTheUnderworld'
    | 'basicAttackBard'
    | 'basicAttackCleric'
    | 'basicAttackKnight'
    | 'basicAttackRogue'
    | 'basicAttackWizard'
    | 'beanNeverMisses'
    | 'bellyFlop'
    | 'berserk'
    | 'bigLunge'
    | 'bless'
    | 'blockBard'
    | 'blockCleric'
    | 'blockKnight'
    | 'blockRogue'
    | 'blockWizard'
    | 'bodySlam'
    | 'burnIncense'
    | 'chainLightning'
    | 'charge'
    | 'cleave'
    | 'compulsiveGambler'
    | 'crimeAlwaysPays'
    | 'cultivate'
    | 'declarationOfPeace'
    | 'dummyBomb'
    | 'dutifulStab'
    | 'enchantedStrike'
    | 'featheredFortress'
    | 'fellTheMighty'
    | 'fireball'
    | 'flashBang'
    | 'gargantuanGnomeBomb'
    | 'gnomeBomb'
    | 'guidingBolt'
    | 'hammerThrow'
    | 'hedgedBet'
    | 'helpingHand'
    | 'hope'
    | 'huntedByTheBean'
    | 'hypnotized'
    | 'itIsWeakToJerry'
    | 'jab'
    | 'jerryIsEternal'
    | 'killingBlow'
    | 'leadRazor'
    | 'magicalTrebuchet'
    | 'magicRitual'
    | 'magicShield'
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
    | 'prayerOfGoodHealth'
    | 'psychicWarfare'
    | 'rapidFireBolts'
    | 'retreat'
    | 'retreatToTheShadows'
    | 'scatterBrained'
    | 'screechOfTheBean'
    | 'shieldOfHolyLight'
    | 'sleepyTimeSpores'
    | 'slipperyLittleGuy'
    | 'smallButStoic'
    | 'smite'
    | 'songOfClarity'
    | 'songOfFortitude'
    | 'songOfGoodHealth'
    | 'songOfSilence'
    | 'songOfTheBrazen'
    | 'songOfTheHuntsman'
    | 'songOfTheWarrior'
    | 'songOfWizardry'
    | 'spellBook'
    | 'stab'
    | 'sweepTheLeg'
    | 'swissArmyWand'
    | 'swordSlash'
    | 'testudoFormation'
    | 'tinyKleptomaniac'
    | 'trance'
    | 'tubularCellWall'
    | 'twistTheKnife'
    | 'valiantJab'
    | 'warStomp'
    | 'whirlingBladesOfDeath'
    | 'youGottaStealMoneyToMakeMoney'
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
