import { Texture } from 'pixi.js'

import { InfoBox } from '@sharedElements'
import type { PixiContainer } from '@/elementsUtil'
import { BASE_HEIGHT, BASE_WIDTH, Container, Sprite } from '@/elementsUtil'

export function LootCollector(): PixiContainer {
    return Container(
        { x: 0, y: 0, scale: 1 },
        InfoBox(
            Sprite({
                src: Texture.WHITE,
                width: BASE_WIDTH * 0.7,
                height: BASE_HEIGHT * 0.9,
                alpha: 0.6,
                anchor: [0.5, 0.5],
                x: BASE_WIDTH / 2,
                y: BASE_HEIGHT / 2,
            })
        )
    )
}
