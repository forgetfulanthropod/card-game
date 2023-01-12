import { startCase } from 'lodash'
import type { CardType } from 'shared'
import { Loader } from 'pixi.js'
import type { CardAssetId, CardTypeAssetId } from '@/assets'
import type { PixiTexture } from '@/elementsUtil'

export function getCardTypeTexture(cardType: CardType): PixiTexture {
    const assetId = `cardType${startCase(cardType)}` as CardTypeAssetId

    return getTexture(assetId)!
}

export function getTexture(assetId: CardAssetId): PixiTexture {
    return (
        Loader.shared.resources?.[assetId]?.texture ??
        throwNull(`texture '${assetId}'`)
    )
}
