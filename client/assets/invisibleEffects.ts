import type { EffectId } from 'shared'

export const invisibleEffects_ = [
    'strongblock',
    'smallDamageIncrease',
    'doubleDamage',
    'passiveBlock',
] as const
export const invisibleEffects: readonly EffectId[] = invisibleEffects_
