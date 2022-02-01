import type { Pile } from '@shared'
import { Loader } from 'pixi.js'

import type { PixiContainer, PixiTexture } from '@/elementsUtil'
import { BASE_HEIGHT, BASE_WIDTH } from '@/elementsUtil'
import { Container, Sprite, Text } from '@/elementsUtil'
import { vals } from '@/util'

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
                    fontFamily: 'VT323',
                },
            }),
        ],
    })
}

function getCardBackPileSizeSrc() {
    return Loader.shared.resources?.cardBackPileSizeOverlay
        ?.texture as PixiTexture
}

function getCardBackSrc() {
    return Loader.shared.resources?.cardBack?.texture as PixiTexture
}
