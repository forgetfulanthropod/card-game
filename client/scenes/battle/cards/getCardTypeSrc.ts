import { startCase } from 'lodash'
import type { CardType } from 'shared'
import { Loader } from 'pixi.js'
import type { CardAssetId, CardTypeAssetId } from '@/scenes'
import type { PixiTexture } from '@/elementsUtil'

export function getCardTypeSrc(cardType: CardType): PixiTexture {
    const assetId = `cardType${startCase(cardType)}` as CardTypeAssetId

    //eslint-disable-next-line
    return getTexture(assetId)!
}

export function getTexture(assetId: CardAssetId): PixiTexture {
    return (
        Loader.shared.resources?.[assetId]?.texture ??
        throwNull(`texture '${assetId}'`)
    )
}
