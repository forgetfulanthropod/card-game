/** An effect is a function on the game state! */

import type { CalculatedCharacterStats } from '@'

/*
Counters:

addCounter(targetUid, counterId)

**Fatigue *(Debuff)***:  Characters with fatigue deal 25% less damage.
**Unguarded** ***(Debuff)*:** Unguarded characters receive 25% more damage.
**Vulnerable *(Debuff*):** Vulnerable characters receive 50% more damage.
**Bleed *(Debuff)***:  Characters with Bleed receive damage equal to 5% of their maximum health at the start of their turn.
**Poison *(Debuff):*** A character takes 1 point of damage for each poison counter it has at the start of its turn (this damage cannot be blocked).
**Stunned *(Debuff)*:** Stunned NPCs skip their next turn.  Stunned player characters cannot play any cards, nor can they switch stances.
**Debilitated *(Debuff)*: Debilitated characters deal 50% less damage.
*/

/** Effects are applied in the order of this array */
export const effectIds = [
    'fatigue',
    'unguarded',
    'vulnerable',
    'bleed',
    'poison',
    'stunned',
    'debilitated',
] as const

export type EffectId = typeof effectIds[number]

export type EffectFunc = (
    _: CalculatedCharacterStats
) => CalculatedCharacterStats

export interface Effect {
    counter: number
    id: EffectId
}
