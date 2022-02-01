import type { CharacterName, EffectType } from '@shared'
import { Loader } from 'pixi.js'

import type { PixiTexture } from '@/elementsUtil'

import type { AssetKey } from './AssetLoader'

export function getEffectIconSrc(effectType: EffectType) {
    const effectToIconMap: Record<EffectType, AssetKey> = {
        Debilitated: 'effectDebilitated',
        DOT1: 'effectPoison',
        DOT2: 'effectBleed',
    }

    const iconId = effectToIconMap[effectType]

    return getTexture(iconId)
}

export const assetIdToSrc = (assetId: CharacterName) => getTexture(assetId)

export function getTexture(assetId: AssetKey): PixiTexture {
    return Loader.shared.resources?.[assetId]?.texture as PixiTexture
}

export function getData(assetId: AssetKey): unknown {
    return Loader.shared.resources?.[assetId]?.data
}
