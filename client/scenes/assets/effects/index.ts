import type { EffectId } from 'shared'
import effectVulnerable from './vulnerable_v2.png'
import effectBleed from './bleed.png'
import effectDebilitated from './debilitated.png'
import effectFatigue from './fatigue.png'
// import effectPiercing from './piercing.png'
import effectPoison from './poison_skull.png'
import effectStunned from './stunned.png'
import effectUnguarded from './unguarded_v2.png'
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
