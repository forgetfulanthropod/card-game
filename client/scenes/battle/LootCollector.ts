import { Texture } from 'pixi.js'

import { InfoBox, ModalBackdrop } from '@sharedElements'
import { PixiContainer, Text } from '@/elementsUtil'
import { BASE_HEIGHT, BASE_WIDTH, Container, Sprite } from '@/elementsUtil'
import { callApi } from '@/callApi'
import { getBattleScene } from '@/data'

export function LootCollector(): PixiContainer {
    const scene = getBattleScene()

    function handleButtonPress() {
        callApi('collectLoot', {})
    }

    function renderLootItems() {
        const items = scene.get('lootEarned').items
        let container = Container({})
        // TODO change below to actual way of calculating where it goes
        let height = 700

        for (let [item, value] of Object.entries(items)) {
            container.addChild(
                Text({
                    text: `${item}: ${value}`,
                    anchor: [0.5, 0],
                    x: BASE_WIDTH,
                    y: height,
                    style: {
                        fontSize: 100,
                        fill: 'white',
                        padding: 4,
                        align: 'left',
                    },
                })
            )
            height += 100
        }

        return container
    }

    return Container(
        { x: 0, y: 0, scale: 0.5 },
        ModalBackdrop(),
        InfoBox(
            Container(
                {},
                renderLootItems(),
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
                    height: 150,
                    alpha: 1,
                    anchor: [0.5, 0.5],
                    x: BASE_WIDTH,
                    y: BASE_HEIGHT + 500,
                    onClick: handleButtonPress,
                }),
                Text({
                    text: 'collect loot',
                    anchor: [0.5, 0.5],
                    x: BASE_WIDTH,
                    y: BASE_HEIGHT + 500,
                    style: { fontSize: 100, fill: 'black', padding: 4 },
                })
            ),
            {
                borderRadius: 12,
                padding: 22,
            }
        )
    )
}
