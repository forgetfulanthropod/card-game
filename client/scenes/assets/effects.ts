import type { EffectId } from 'shared'
// const effectPiercing = 'effects/piercing.png'
const invisibleEffects_ = [
    'strongblock',
    'smallDamageIncrease',
    'doubleDamage',
    'passiveBlock',
] as const
export const invisibleEffects: readonly EffectId[] = invisibleEffects_
export type VisibleEffect = Exclude<EffectId, typeof invisibleEffects_[number]>
export const effectAssets: {
    [K in VisibleEffect as `effect${Capitalize<K>}`]: string
} = {
    effectVulnerable: 'effects/vulnerable_v2.png',
    effectBleed: 'effects/bleed.png',
    effectDebilitated: 'effects/debilitated.png',
    effectFatigue: 'effects/fatigue.png',
    // effectPiercing,
    effectPoison: 'effects/poison_skull.png',
    effectStunned: 'effects/stunned.png',
    effectUnguarded: 'effects/unguarded_v2.png',
}
