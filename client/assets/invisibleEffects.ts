import type { EffectId } from 'shared'

export const invisibleEffects_ = [
    'smallDamageIncrease',
    'doubleDamage',
    'passiveBlock',
] as const
export const invisibleEffects: readonly EffectId[] = invisibleEffects_
