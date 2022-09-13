import { Texture } from 'pixi.js'

import { ModalBackdrop } from '@sharedElements'
import {
    getTexture,
    PixiContainer,
    Text,
    TweenableContainer,
} from '@/elementsUtil'
import { BASE_HEIGHT, BASE_WIDTH, Container, Sprite } from '@/elementsUtil'
import { callApi } from '@/callApi'
import { getBattleScene } from '@/data'
import { animateTo } from '../shared/cards/Hand'

const roomClearedFinalPosition = {
    rotation: 0,
    scale: 1,
    x: 0,
    y: -600,
}

const lootItemsFinalPosition = {
    rotation: 0,
    scale: 1,
    x: BASE_WIDTH,
    y: -100,
}

export function LootCollector(): PixiContainer {
    const scene = getBattleScene()
    const lootScreenHasOpened = scene.get('lootScreenHasOpened')

    if (lootScreenHasOpened === false) {
        setTimeout(() => {
            animateTo(roomClearedSign, roomClearedFinalPosition)
            animateTo(lootItemsContainer, lootItemsFinalPosition)
        }, 2000)
    }

    let currLootItemsX = lootItemsFinalPosition.x

    function handleButtonPress() {
        callApi('collectLoot', {})

        lootItemsContainer.removeChildAt(0)
        currLootItemsX = currLootItemsX - 900
        animateTo(lootItemsContainer, {
            x: currLootItemsX,
            y: 0,
            scale: 0.2,
            rotation: 0,
        })
    }

    const [currentLootItem, ...remainingLootItems] = renderLoot()

    const lootItemsContainer = TweenableContainer(
        {
            x: lootScreenHasOpened ? lootItemsFinalPosition.x : 5000,
        },
        currentLootItem,
        ...remainingLootItems
    )

    function renderLoot() {
        const lootItems = scene.get('lootEarned')

        let lootItemsContainerX = 0
        let lootItemsContainerY = BASE_HEIGHT + 200

        return lootItems.map((lootItem, idx) => {
            let item = lootItem.name as string
            let itemSrc = item === 'draftCard' ? 'cardBack' : item

            const scale = idx === 0 ? 1.5 : 1
            const src = getTexture(itemSrc)

            const itemBoxHeight = 650

            const lootContainerArgs = {
                x: lootItemsContainerX,
                y: lootItemsContainerY,
                onClick: () => handleButtonPress(),
            }

            lootItemsContainerX += 900

            const BlackRectBackground = Sprite({
                src: Texture.WHITE,
                scale: 1,
                tint: 0,
                height: itemBoxHeight * scale,
                width: 600 * scale,
                alpha: 0.5,
                anchor: [0.5, 0.5],
                x: 0,
                y: 0,
            })

            const LootItemSprite = Sprite({
                src,
                scale: 2 * scale,
                anchor: [0.5, 0.5],
                x: 0,
                y: 50 * scale * 1.5,
            })

            const LootItemText = Text({
                text:
                    item === 'draftCard' ? 'Draft a Card' : `Collect \n${item}`,
                anchor: [0.5, 0],
                x: 0,
                y: -(itemBoxHeight / 2) * scale + (50 + scale),
                style: {
                    fontSize: 80 * scale,
                    fill: 'white',
                    padding: 4,
                    align: 'center',
                    fontWeight: 'bold',
                },
            })

            const InactiveLootItemOverlay = Sprite({
                src: Texture.WHITE,
                scale: 1,
                tint: 0,
                height: itemBoxHeight,
                width: 600,
                alpha: 0.5,
                anchor: [0.5, 0.5],
                x: 0,
                y: 0,
            })

            const lootContainerChildren = [
                BlackRectBackground,
                LootItemSprite,
                LootItemText,
                idx !== 0 && InactiveLootItemOverlay,
            ]

            return Container(lootContainerArgs, ...lootContainerChildren)
        })
    }

    const roomClearedSign = TweenableContainer(
        {},
        Sprite({
            src: getTexture('roomClearedSign'),
            alpha: 1,
            x: lootScreenHasOpened ? roomClearedFinalPosition.x : 0,
            y: lootScreenHasOpened ? roomClearedFinalPosition.y : 0,
        })
    )

    return Container(
        { x: 0, y: 0, scale: 0.5 },
        ModalBackdrop(),
        Container({}, lootItemsContainer, roomClearedSign)
    )
}
