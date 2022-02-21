import type { CardId, CardType, CharacterName, EffectType } from '@shared'
import { startCase } from 'lodash'
import { Loader } from 'pixi.js'

import type { PixiTexture } from '@/elementsUtil'

import type { AssetKey } from './AssetLoader'
import type { CardArtAssetId, CardTypeAssetId } from './cardAssets'

export function getCardSrc(cardId: CardId): PixiTexture {
    const assetId = `card${startCase(cardId).replace(
        / /g,
        ''
    )}` as CardArtAssetId

    return getTexture(assetId)
}

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

export const assetIdToSrc = (assetId: CharacterName) => getTexture(assetId)

export function getTexture(assetId: AssetKey): PixiTexture {
    //eslint-disable-next-line
    return Loader.shared.resources?.[assetId]?.texture! as PixiTexture
}

export function getData(assetId: AssetKey): unknown {
    return Loader.shared.resources?.[assetId]?.data
}
