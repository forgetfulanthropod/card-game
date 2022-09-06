import { Texture } from 'pixi.js'

import { InfoBox, ModalBackdrop } from '@sharedElements'
import {
    getTexture,
    PixiContainer,
    Text,
    TweenablePixiContainer,
} from '@/elementsUtil'
import { BASE_HEIGHT, BASE_WIDTH, Container, Sprite } from '@/elementsUtil'
import { callApi } from '@/callApi'
import { getBattleScene } from '@/data'
import { animateTo } from '../shared/cards/Hand'

export function LootCollector(): PixiContainer {
    const scene = getBattleScene()

    setTimeout(() => {
        animateTo(roomClearedSign, {
            rotation: 0,
            scale: 1,
            x: 0,
            y: -600,
        }),
        animateTo(lootIconsAndValues, {
            rotation: 0,
            scale: 1,
            x: BASE_WIDTH / 2 - 300,
            y:0
        })
    }, 2000)

    // need to store in state which things have been clicked
    function handleButtonPress() {
        callApi('collectLoot', {})
    }

    function renderLoot() {
        const items = { 'cardBack': 1, ...scene.get('lootEarned').items}
        let container = Container({
            x: 3000
        })

        // TODO change below to a better way of calculating where it goes
        let height = 950
        let width = 1600

        for (let [item, value] of Object.entries(items)) {
            // temp filter out other things in loot
            if (
                !['fishStick', 'swordShield', 'potion', 'bread', 'cardBack'].includes(item)
            ) {
                continue
            }

            const src = getTexture(item)

            container.addChild(
                Container(
                    {
                        x: 0 - 350,
                        onClick: handleButtonPress
                    },
                    // Dark backdrop
                    Sprite({
                        src: Texture.WHITE,
                        scale: 1,
                        tint: 0,
                        height: 650,
                        width: 600,
                        alpha: 0.5,
                        anchor: [0.5, 0.1],
                        x: width,
                        y: height,
                    }),
                    // Actual item
                    Sprite({
                        src,
                        scale: 2,
                        anchor: [0.5, 0],
                        x: width,
                        y: height + 100,
                    }),
                    Text({
                        text: item === 'cardBack' ? 'draft a card' : `collect ${item}`,
                        anchor: [0.5, 0],
                        x: width,
                        y: height - 50,
                        style: {
                            fontSize: 80,
                            fill: 'white',
                            padding: 4,
                            align: 'left',
                            fontWeight: 'bold'
                        },
                    })
                )
            )
            // increase width to space out items
            width += 900
        }

        return container
    }

    const lootIconsAndValues = renderLoot() as TweenablePixiContainer

    const roomClearedSign = Container(
        {},
        Sprite({
            src: getTexture('roomClearedSign'),
            alpha: 1,
            x: 0,
            y: 0,
        })
    ) as TweenablePixiContainer

    return Container(
        { x: 0, y: 0, scale: 0.5 },
        ModalBackdrop(),
        Container({}, lootIconsAndValues, roomClearedSign)
    )
}
