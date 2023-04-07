import type { EffectId } from 'shared'

export const invisibleEffects_ = [
    'smallDamageIncreaseBuff',
    'doubleDamageBuff',
    'passiveBlockBuff',
    'cowardsCrown',
    'ignoreAggressive',
    'yodelBuff',
    // 'lilTasteDebuff',
    'immuneToPoisonBuff',
    'damageTakeSubtractorBuff',
    'damageTakeAddendDebuff',
    'lockStanceDebuff',
    'counterAttackBuff',
    'mutuallyAssuredDestructionBuff',
] as const

export const invisibleEffects: readonly EffectId[] = invisibleEffects_
