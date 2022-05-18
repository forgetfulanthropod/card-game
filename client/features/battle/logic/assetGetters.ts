import { startCase, upperFirst } from 'lodash'
import { Loader } from 'pixi.js'
import type { CardType, CharacterName, EffectType, OrbType } from 'shared'

import type { PixiTexture } from '@/elementsUtil'

import type { AssetKey } from './AssetLoader'
import type { CardTypeAssetId } from './cardAssets'
import type { OrbAssetId } from './orbAssets'

export function getCardTypeSrc(cardType: CardType): PixiTexture {
    const assetId = `cardType${startCase(cardType)}` as CardTypeAssetId

    //eslint-disable-next-line
    return getTexture(assetId)!
}

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

export function getTexture(assetId: AssetKey): PixiTexture {
    return (
        Loader.shared.resources?.[assetId]?.texture ??
        throwNull(`texture '${assetId}'`)
    )
}
export function hasTexture(assetId: AssetKey): boolean {
    return Loader.shared.resources?.[assetId] != null
}
