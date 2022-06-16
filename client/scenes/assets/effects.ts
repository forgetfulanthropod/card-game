import type { EffectId } from 'shared'
const effectVulnerable = 'effects/vulnerable_v2.png'
const effectBleed = 'effects/bleed.png'
const effectDebilitated = 'effects/debilitated.png'
const effectFatigue = 'effects/fatigue.png'
// const effectPiercing = 'effects/piercing.png'
const effectPoison = 'effects/poison_skull.png'
const effectStunned = 'effects/stunned.png'
const effectUnguarded = 'effects/unguarded_v2.png'
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
    effectVulnerable,
    effectBleed,
    effectDebilitated,
    effectFatigue,
    // effectPiercing,
    effectPoison,
    effectStunned,
    effectUnguarded,
}
