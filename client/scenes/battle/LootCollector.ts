import { Texture } from 'pixi.js'

import { InfoBox } from '@sharedElements'
import { PixiContainer, Text } from '@/elementsUtil'
import { BASE_HEIGHT, BASE_WIDTH, Container, Sprite } from '@/elementsUtil'

export function LootCollector(): PixiContainer {
    function dismissLootCollector() {
        console.log('testing')
    }

    return Container(
        { x: 0, y: 0, scale: 0.5 },
        InfoBox(
            Container(
                {},
                Sprite({
                    src: Texture.WHITE,
                    width: BASE_WIDTH * 0.6,
                    height: BASE_HEIGHT * 0.7,
                    alpha: 0.6,
                    anchor: [0.5, 0.5],
                    x: BASE_WIDTH,
                    y: BASE_HEIGHT,
                }),
                Sprite({
                    src: Texture.WHITE,
                    width: BASE_WIDTH * 0.6,
                    height: 100,
                    alpha: 1,
                    anchor: [0.5,0.5],
                    x: BASE_WIDTH,
                    y: BASE_HEIGHT + 500,
                    onClick: dismissLootCollector,
                }).addChild(Text({
                    text: 'collect loot',
                    anchor: [0.5,0.5],
                    x: BASE_WIDTH,
                    y: BASE_HEIGHT + 500,
                    style: { fontSize: 100, fill: 'white' },
                }))
            ),
            {
                borderRadius: 12,
                padding: 22,
            }
        )
    )
}
