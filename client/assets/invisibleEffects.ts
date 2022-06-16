import type { EffectId } from 'shared'

// const effectPiercing = 'effects/piercing.png'
export const invisibleEffects_ = [
    'strongblock',
    'smallDamageIncrease',
    'doubleDamage',
    'passiveBlock',
] as const
export const invisibleEffects: readonly EffectId[] = invisibleEffects_
