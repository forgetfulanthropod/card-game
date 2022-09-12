import { Texture } from 'pixi.js'

import { InfoBox, ModalBackdrop } from '@sharedElements'
import {
    getTexture,
    PixiContainer,
    Text,
    TweenablePixiContainer,
    PixiText,
} from '@/elementsUtil'
import { BASE_HEIGHT, BASE_WIDTH, Container, Sprite } from '@/elementsUtil'
import { callApi } from '@/callApi'
import { getBattleScene } from '@/data'
import { animateTo } from '../shared/cards/Hand'

export function LootCollector(): PixiContainer {
    const scene = getBattleScene()
    const lootScreenHasOpened = scene.get('lootScreenHasOpened')

    let roomClearedFinalPosition = {
        rotation: 0,
        scale: 1,
        x: 0,
        y: -600,
    }
    let lootItemsFinalPosition = {
        rotation: 0,
        scale: 1,
        x: BASE_WIDTH / 2 - 300,
        y: 0,
    }

    if (lootScreenHasOpened === false) {
        setTimeout(() => {
            animateTo(roomClearedSign, roomClearedFinalPosition)
            animateTo(lootIconsAndValues, lootItemsFinalPosition)
        }, 2000)
    }

    function renderLoot() {
        const lootItems = scene.get('lootEarned')
        let container = Container({
            x: lootScreenHasOpened ? lootItemsFinalPosition.x : 3000,
        })

        // TODO change below to a better way of calculating where it goes
        let height = 950
        let width = 1600
        let idx = 0

        let x = -200

        // need to store in state which things have been clicked
        function handleButtonPress(elementToUpdate?: PixiText) {
            callApi('collectLoot', {})
            lootIconsAndValues.removeChildAt(0)
            animateTo(lootIconsAndValues, {
                x: x,
                y: 0,
                scale: 0.2,
                rotation: 0,
            })

            x = x - 900
        }

        for (let lootItem of lootItems) {
            let item = lootItem.name as string
            let itemSrc = item === 'draftCard' ? 'cardBack' : item

            const scale = idx === 0 ? 1.5 : 1
            const src = getTexture(itemSrc)

            container.addChild(
                Container(
                    {
                        x: 0 - 350,
                        onClick:
                            // TODO: only allow current active loot to be clicked
                            // idx === 0 ?
                            () => handleButtonPress()
                        // : void 0,
                    },
                    // Dark backdrop
                    Sprite({
                        src: Texture.WHITE,
                        scale: 1,
                        tint: 0,
                        height: 650 * scale,
                        width: 600 * scale,
                        alpha: 0.5,
                        anchor: [0.5, 0.1],
                        x: width,
                        y: height,
                    }),
                    // Actual item
                    Sprite({
                        src,
                        scale: 2 * scale,
                        anchor: [0.5, 0],
                        x: width,
                        y: height + 100 * scale * 1.5,
                    }),
                    Text({
                        text:
                            item === 'draftCard'
                                ? 'Draft a Card'
                                : `Collect ${item}`,
                        anchor: [0.5, 0],
                        x: width,
                        y: height - 50,
                        style: {
                            fontSize: 80 * scale,
                            fill: 'white',
                            padding: 4,
                            align: 'left',
                            fontWeight: 'bold',
                        },
                    })
                )
            )

            if (idx !== 0) {
                const containerChild = container.getChildAt(
                    idx
                ) as PixiContainer
                containerChild.addChild(
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
                    })
                )
            }
            // increase width to space out items
            width += 900
            idx++
        }

        return container
    }

    const lootIconsAndValues = renderLoot() as TweenablePixiContainer

    const roomClearedSign = Container(
        {},
        Sprite({
            src: getTexture('roomClearedSign'),
            alpha: 1,
            x: lootScreenHasOpened ? roomClearedFinalPosition.x : 0,
            y: lootScreenHasOpened ? roomClearedFinalPosition.y : 0,
        })
    ) as TweenablePixiContainer

    return Container(
        { x: 0, y: 0, scale: 0.5 },
        ModalBackdrop(),
        Container({}, lootIconsAndValues, roomClearedSign)
    )
}
