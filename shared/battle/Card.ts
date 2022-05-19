import type { CardUid, CharacterUid, PileId } from '..'
import type { CharacterClass } from './Characters'

export interface Card {
    name: string
    energy: number
    id: CardId
    targetNum: number
    targetType: TargetType
    actions: string
    type: CardType
    characterClass: CharacterClass
    // dynamic
    characterUid: CharacterUid
    explanation: string
}
export type CardType = 'attack' | 'defense' | 'enchantment' | 'utility'

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
