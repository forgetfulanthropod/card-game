import { upperFirst } from 'lodash'
import type { CharacterName, EffectType, OrbType } from 'shared'
import type { OrbAssetId } from './orbAssets'
import type { AssetKey } from '@/elementsUtil'
import { isTextureKey, PixiTexture, getTexture } from '@/elementsUtil'

export function getEffectIconSrc(effectType: EffectType): PixiTexture {
    const effectToIconMap: Record<EffectType, AssetKey> = {
        Debilitated: 'effectDebilitated',
        DOT1: 'effectPoison',
        DOT2: 'effectBleed',
    }

    const iconId = effectToIconMap[effectType]

    return getTexture(iconId)
}

export const getCharTexture = (charId: CharacterName) =>
    isTextureKey(charId) ? getTexture(charId) : PixiTexture.WHITE

export const getOrbTexture = (orbType: OrbType) =>
    getTexture(`orbOf${upperFirst(orbType)}` as OrbAssetId)
