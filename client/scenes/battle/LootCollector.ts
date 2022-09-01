import { Texture } from 'pixi.js'

import { InfoBox, ModalBackdrop } from '@sharedElements'
import { getTexture, PixiContainer, Text } from '@/elementsUtil'
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

        // TODO change below to a better way of calculating where it goes
        let height = 900
        let width = 1600

        for (let [item, value] of Object.entries(items)) {
            // temp filter out other things in loot
            if (
                !['fishStick', 'swordShield', 'potion', 'bread'].includes(item)
            ) {
                continue
            }

            const src = getTexture(item)

            container.addChild(
                Container(
                    {
                        x: 0 - 350,
                    },
                    // Dark backdrop
                    Sprite({
                        src: Texture.WHITE,
                        scale: 1,
                        tint: 0,
                        height: 250,
                        width: 300,
                        alpha: 0.5,
                        anchor: [0.5, 0.1],
                        x: width,
                        y: height,
                    }),
                    // Actual item
                    Sprite({
                        src,
                        scale: 1,
                        anchor: [0.5, 0],
                        x: width,
                        y: height,
                    }),
                    Text({
                        text: `${value}`,
                        anchor: [0.5, 0],
                        x: width,
                        y: height + 250,
                        style: {
                            fontSize: 80,
                            fill: 'white',
                            padding: 4,
                            align: 'left',
                        },
                    })
                )
            )

            // increase width to space out items
            width += 450
        }

        return container
    }

    return Container(
        { x: 0, y: 0, scale: 0.5 },
        ModalBackdrop(),
        InfoBox(
            Container(
                {},
                Sprite({
                    src: Texture.WHITE,
                    width: BASE_WIDTH,
                    height: BASE_HEIGHT * 0.9,
                    alpha: 0.6,
                    anchor: [0.5, 0.5],
                    x: BASE_WIDTH,
                    y: BASE_HEIGHT,
                }),
                renderLootItems(),
                Sprite({
                    src: Texture.WHITE,
                    width: BASE_WIDTH,
                    height: 250,
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
