import type { EffectId } from 'shared'

export const invisibleEffects_ = [
    'smallDamageIncreaseBuff',
    'doubleDamageBuff',
    'passiveBlockBuff',
    'cowardsCrown',
    'ignoreAggressive',
    'yodelBuff',
] as const
export const invisibleEffects: readonly EffectId[] = invisibleEffects_
