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
    return Container({
        x: BASE_WIDTH * 0.96,
        y: BASE_HEIGHT * 0.98,
        scale: 0.7,
        angle: 20,
        children: [
            Sprite({
                src: getCardBackSrc(),
                anchor: [1, 1],
            }),
            Sprite({
                src: getCardBackPileSizeSrc(),
                x: -getCardBackSrc().width,
                y: -getCardBackSrc().height,
                anchor: [0.5, 0.5],
            }),
            Text({
                text: `${vals(pile).length}`,
                anchor: [0.5, 0.5],
                x: -getCardBackSrc().width,
                y: -getCardBackSrc().height,
                width: getCardBackPileSizeSrc().width * 0.5,
                height: getCardBackPileSizeSrc().height * 0.5,
                style: {
                    fill: 0xffffff,
                    fontSize: 150,
                    fontFamily: 'bigFont',
                },
            }),
        ],
    })
}

function getCardBackPileSizeSrc() {
    return getTexture('cardBackPileSizeOverlay')
}

function getCardBackSrc() {
    return getTexture('cardBack')
}
