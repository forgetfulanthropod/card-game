import type { EffectType } from '@shared'
import { Loader } from 'pixi.js'

export function getEffectIconSrc(effectType: EffectType) {
    const effectToIconMap: Record<EffectType, string> = {
        Debilitated: 'effectDebilitated',
        DOT1: 'effectPoison',
        DOT2: 'effectBleed',
    }

    const iconId = effectToIconMap[effectType]

    return Loader.shared.resources?.[iconId]?.texture
}
