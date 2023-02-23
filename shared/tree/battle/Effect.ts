/** An effect is a function on the game state! */

/*
Counters:

addCounter(targetUid, counterId)

**Bleed *(Debuff)***:  Characters with Bleed receive damage equal to 5% of their maximum health at the start of their turn.
**Debilitated *(Debuff)*: Debilitated characters deal 50% less damage.
**Fatigue *(Debuff)***:  Characters with fatigue deal 25% less damage.
**Poison *(Debuff):*** A character takes 1 point of damage for each poison counter it has at the start of its turn (this damage cannot be blocked).
**Stunned *(Debuff)*:** Stunned NPCs skip their next turn.  Stunned player characters cannot play any cards, nor can they switch stances.
**Unguarded** ***(Debuff)*:** Unguarded characters receive 25% more damage.
**Vulnerable *(Debuff*):** Vulnerable characters receive 50% more damage.
*/

/** Effects are applied in the order of this array */
export const effectIds = [
    'stunnedDebuff',

    'bleedDebuff',
    'poisonedDebuff',

    'tiredDebuff',
    'fatiguedDebuff',
    'debilitatedDebuff',

    'unreadyDebuff',
    'unguardedDebuff',
    'vulnerableDebuff',

    'targetedDebuff',

    'passiveBlockBuff',
    'reflectBuff',
    'strongblockBuff',

    'braveBuff',
    'courageousBuff',
    'guardedBuff',

    'entrancedBuff',

    'berserkBuff',

    'smallDamageIncreaseBuff',
    'doubleDamageBuff',
    'stampBuff',
    'chargedBombBuff',

    'cowardsCrown',
    'ignoreAggressive',
] as const

/** Effects which are cleared on turn end */
export const turnEndClearEffects: EffectId[] = ['smallDamageIncreaseBuff']

export type EffectId = typeof effectIds[number]

export interface Effect {
    counter: number
    id: EffectId
}
