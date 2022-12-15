import type { Pile } from 'shared'

import { vals } from 'shared/code'
import { getTexture } from './getCardTypeSrc'
import type { PixiContainer } from '@/elementsUtil'
import {
    BASE_HEIGHT,
    BASE_WIDTH,
    Container,
    Sprite,
    Text,
} from '@/elementsUtil'

export function DiscardPile(pile: Pile): PixiContainer {
    const src = getTexture('discardPile')
    return Container(
        {
            x: BASE_WIDTH,
            y: BASE_HEIGHT,
        },

        Sprite({
            src,
            anchor: [1, 1],
        }),
        Sprite({
            src: getCardBackPileSizeSrc(),
            scale: 0.7,
            x: -src.width,
            y: -65,
            anchor: [0.5, 0.5],
        }),
        Text({
            text: `${vals(pile).length}`,
            anchor: [0.5, 0.5],
            x: -src.width,
            y: -65,
            // width: getCardBackPileSizeSrc().width * 0.5,
            // height: getCardBackPileSizeSrc().height * 0.5,
            style: {
                fill: 0xffffff,
                fontSize: 48 * 0.7,
                fontFamily: 'bigFont',
            },
        })
    )
}

function getCardBackPileSizeSrc() {
    return getTexture('cardBackPileSizeOverlay')
}
