import { upperFirst } from 'lodash'
import type { CharacterId, OrbType } from 'shared'
import { Loader } from 'pixi.js'
import type { OrbAssetId, SpineAsset, VisibleEffect } from './assetTypes'
import { isTextureKey, PixiTexture, getTexture } from '@/elementsUtil'

export function getEffectIconSrc<T extends VisibleEffect>(
    effectType: T
): PixiTexture {
    const id = `effect${upperFirst(effectType)}` as `effect${Capitalize<T>}`
    return getTexture(id)
}

export const getCharTexture = (charId: CharacterId) =>
    isTextureKey(charId) ? getTexture(charId) : PixiTexture.WHITE

export const getOrbTexture = (orbType: OrbType) =>
    getTexture(`orbOf${upperFirst(orbType)}` as OrbAssetId)

export function getValidSpineAssetName(
    name: CharacterId,
    isPc?: boolean
): SpineAsset | null {
    const haveEvilVersions: Partial<Record<CharacterId, boolean>> = {
        skeletonWarrior: true,
        matchaGelatinCube: true,
    }

    //@ts-expect-error TODO this goes away when all characters have spines...
    const assetName: SpineAsset =
        !isPc && haveEvilVersions[name] ? `${name}NPCSpine` : `${name}Spine`

    if (Loader.shared.resources[assetName]) return assetName

    return null
}
