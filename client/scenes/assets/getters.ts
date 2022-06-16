import { upperFirst } from 'lodash'
import type { CharacterName, OrbType } from 'shared'
import { Loader } from 'pixi.js'
import type { OrbAssetId, SpineAsset, VisibleEffect } from './assetTypes'
import { isTextureKey, PixiTexture, getTexture } from '@/elementsUtil'

export function getEffectIconSrc<T extends VisibleEffect>(
    effectType: T
): PixiTexture {
    const id = `effect${upperFirst(effectType)}` as `effect${Capitalize<T>}`
    return getTexture(id)
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
