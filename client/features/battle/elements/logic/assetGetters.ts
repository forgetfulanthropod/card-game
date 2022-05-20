import { upperFirst } from 'lodash'
import type { CharacterName, EffectType, OrbType } from 'shared'
import type { OrbAssetId } from './orbAssets'
import type { AssetKey, PixiTexture } from '@/elementsUtil'
import { getTexture } from '@/elementsUtil'

export function getEffectIconSrc(effectType: EffectType): PixiTexture {
    const effectToIconMap: Record<EffectType, AssetKey> = {
        Debilitated: 'effectDebilitated',
        DOT1: 'effectPoison',
        DOT2: 'effectBleed',
    }

    const iconId = effectToIconMap[effectType]

    return getTexture(iconId)
}

export const getCharTexture = (charId: CharacterName) => getTexture(charId)

export const getOrbTexture = (orbType: OrbType) =>
    getTexture(`orbOf${upperFirst(orbType)}` as OrbAssetId)
