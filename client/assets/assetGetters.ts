import { upperFirst } from 'lodash'
import type { CharacterId, OrbType } from 'shared'
import { Loader } from 'pixi.js'
import type { OrbAssetId, SpineAsset, VisibleEffect } from './assetTypes'
import { isTextureKey, PixiTexture, getTexture } from '@/elementsUtil'
import { Spine } from '@pixi-spine/all-4.1'

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

export const haveEvilVersions: Partial<Record<CharacterId, boolean>> = {
    skeletonWarrior: true,
    matchaGelatinCube: true,
    mimic: true,
}

export const haveEvilSkins: Partial<Record<CharacterId, boolean>> = {
    orcWarrior: true,
    warhog: true,
}

export function getValidSpineAssetName(
    name: CharacterId,
    isPc?: boolean
): SpineAsset {
    //@ts-expect-error // todo, delete NPC spine suffix code
    const assetName: SpineAsset =
        !isPc && haveEvilVersions[name] ? `${name}NPCSpine` : `${name}Spine`

    return assetName
}
