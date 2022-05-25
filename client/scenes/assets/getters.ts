import { upperFirst } from 'lodash'
import type { CharacterName, EffectType, OrbType } from 'shared'
import { Loader } from 'pixi.js'
import type { OrbAssetId } from './orbs'
import type { SpineAsset } from './spines'
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

export function getValidSpineAssetName(name: CharacterName): SpineAsset | null {
    //@ts-expect-error TODO this goes away when all characters have spines...
    const assetName: SpineAsset = `${name}Spine`

    if (Loader.shared.resources[assetName]) return assetName

    return null
}
