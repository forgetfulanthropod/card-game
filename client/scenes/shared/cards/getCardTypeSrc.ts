import { startCase } from 'lodash'
import type { CardType } from 'shared'
import { Assets } from 'pixi.js'
import type { CardAssetId, CardTypeAssetId } from '@/assets'
import type { PixiTexture } from '@/elementsUtil'

export function getCardTypeTexture(cardType: CardType): PixiTexture {
    const assetId = `cardType${startCase(cardType)}` as CardTypeAssetId

    return getTexture(assetId)!
}

export function getTexture(assetId: CardAssetId): PixiTexture {
    return Assets.get(assetId) ?? throwNull(`texture '${assetId}'`)
}
