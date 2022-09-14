import { Texture } from 'pixi.js'

import { ModalBackdrop } from '@sharedElements'
import {
    getTexture,
    PixiContainer,
    Text,
    TweenableContainer,
    TweenablePixiContainer,
} from '@/elementsUtil'
import { BASE_HEIGHT, BASE_WIDTH, Container, Sprite } from '@/elementsUtil'
import { callApi } from '@/callApi'
import { getBattleScene } from '@/data'
import { animateTo } from '../shared/cards/Hand'

const ROOM_CLEARED_FINAL_POS = {
    rotation: 0,
    scale: 1,
    x: 0,
    y: -600,
}

const LOOT_ITEMS_FINAL_POS = {
    rotation: 0,
    scale: 1,
    x: BASE_WIDTH,
    y: -100,
}

const LOOT_ITEMS_START_POS = {
    x: 5000,
}

const ITEM_BOX_HEIGHT = 650
const ITEM_BOX_WIDTH = 600

const getScale = ({ idx }: { idx: number }) => (idx === 0 ? 1.5 : 1)

export function LootCollector(): PixiContainer {
    const scene = getBattleScene()
    const lootScreenHasOpened = scene.get('lootScreenHasOpened')

    if (lootScreenHasOpened === false) {
        setTimeout(() => {
            animateTo(roomClearedSign, ROOM_CLEARED_FINAL_POS)
            animateTo(lootItemsContainer, LOOT_ITEMS_FINAL_POS)
        }, 2000)
    }

    const [currentLootItem, ...remainingLootItems] = renderLoot()

    const lootItemsContainer = TweenableContainer(
        {
            x: lootScreenHasOpened
                ? LOOT_ITEMS_FINAL_POS.x
                : LOOT_ITEMS_START_POS.x,
        },
        currentLootItem,
        ...remainingLootItems
    )

    function renderLoot() {
        const lootItems = scene.get('lootEarned')

        let lootItemsContainerX = -900
        let lootItemsContainerY = BASE_HEIGHT + 200

        return lootItems.map((item, idx) => {
            let itemSrc = item.name === 'draftCard' ? 'cardBack' : item.name
            const scale = getScale({ idx })
            const lootItemContainerArgs = {
                name: `LootItemContainer_${item.name}`,
                x: (lootItemsContainerX += 900),
                y: lootItemsContainerY,
                onClick: idx === 0 ? () => handleButtonPress() : () => {},
                idx,
            }

            if (item.name === 'treasureChest')
                return TreasureChest(lootItemContainerArgs)

            const BlackRectBackground = Sprite({
                src: Texture.WHITE,
                scale: 1,
                tint: 0,
                height: ITEM_BOX_HEIGHT * scale,
                width: ITEM_BOX_WIDTH * scale,
                alpha: 0.5,
                anchor: [0.5, 0.5],
                x: 0,
                y: 0,
                name: 'BlackRectBackground',
            })

            const LootItemSprite = Sprite({
                src: getTexture(itemSrc),
                scale: 2 * scale,
                anchor: [0.5, 0.5],
                x: 0,
                y: 50 * scale * 1.5,
                name: 'LootItemSprite',
            })

            const LootItemText = Text({
                text:
                    item.name === 'draftCard'
                        ? 'Draft a Card'
                        : `Collect \n${item.name}`,
                anchor: [0.5, 0],
                x: 0,
                y: -(ITEM_BOX_HEIGHT / 2) * scale + (50 + scale),
                style: {
                    fontSize: 80 * scale,
                    fill: 'white',
                    padding: 4,
                    align: 'center',
                    fontWeight: 'bold',
                },
                name: 'LootItemText',
            })

            const InactiveLootItemOverlay = Sprite({
                src: Texture.WHITE,
                scale: 1,
                tint: 0,
                height: ITEM_BOX_HEIGHT,
                width: ITEM_BOX_WIDTH,
                alpha: 0.5,
                anchor: [0.5, 0.5],
                x: 0,
                y: 0,
                name: 'InactiveLootItemOverlay',
            })

            const lootItemContainerChildren = [
                BlackRectBackground,
                LootItemSprite,
                LootItemText,
            ]

            if (idx !== 0)
                lootItemContainerChildren.push(InactiveLootItemOverlay)

            return Container(
                lootItemContainerArgs,
                ...lootItemContainerChildren
            )
        })
    }

    const roomClearedSign = TweenableContainer(
        {},
        Sprite({
            src: getTexture('roomClearedSign'),
            alpha: 1,
            x: lootScreenHasOpened ? ROOM_CLEARED_FINAL_POS.x : 0,
            y: lootScreenHasOpened ? ROOM_CLEARED_FINAL_POS.y : 0,
        })
    )

    function handleButtonPress() {
        callApi('collectLoot', {})
        shiftCurrentItem(lootItemsContainer)
    }

    function shiftCurrentItem(el: TweenablePixiContainer) {
        el.removeChildAt(0) // removes the current loot item (eg. the now-previous loot item)
        currLootItemsX = currLootItemsX - 900
        animateTo(el, {
            x: currLootItemsX,
            y: 0,
            scale: 1,
            rotation: 0,
        })

        const newCurrentItem = el.getChildAt(0) as TweenablePixiContainer
        transformIntoCurrentItem(newCurrentItem)
        applyOnClick(newCurrentItem, () => handleButtonPress())
    }

    function transformIntoCurrentItem(el: TweenablePixiContainer) {
        if (el.name === 'TreasureChestContainer') {
            setTimeout(() => {
                el.scale = { x: 1.25, y: 1.25 }
            }, 500)
            return
        }

        const newScale = getScale({ idx: 0 })
        el.height = ITEM_BOX_HEIGHT * newScale
        el.width = ITEM_BOX_WIDTH * newScale
        el.getChildByName('InactiveLootItemOverlay').destroy()
    }

    function applyOnClick(
        el: PixiContainer | TweenablePixiContainer,
        onClick: () => void
    ) {
        el.interactive = true
        el.cursor = `url('assets/root/hand.webp'), pointer`
        el.on('pointerdown', onClick)
    }

    let currLootItemsX = LOOT_ITEMS_FINAL_POS.x

    const LootCollectorContainer = Container(
        { x: 0, y: 0, scale: 0.5, name: 'LootCollector' },
        ModalBackdrop(),
        lootItemsContainer,
        roomClearedSign
    )

    return LootCollectorContainer
}

function TreasureChest(args: { x: number; onClick: () => void; idx: number }) {
    const { x, onClick, idx } = args
    const chestBodySrc = getTexture('chestBody')
    const chestLidSrc = getTexture('chestLid')

    const ChestBodySprite = Sprite({
        src: chestBodySrc,
        anchor: [0.5, 0.5],
        x: 0,
        y: 0,
        name: 'ChestBodySprite',
    })

    const ChestLidSprite = Sprite({
        src: chestLidSrc,
        anchor: [0.5, 0.5],
        x: 0,
        y: -100,
        name: 'ChestLidSprite',
    })

    const ChestProgressText = Text({
        text: 'Chest Progress:',
        anchor: [0.5, 0.5],
        x: 0,
        y: 425,
        style: {
            fontSize: 40,
            fill: 'white',
            padding: 4,
            align: 'center',
            fontWeight: 'bold',
        },
        name: 'LootItemText',
    })

    const ChestProgressSprite = Sprite({
        src: 'healthBarBacking',
        anchor: [0.5, 0.5],
        y: 550,
        scale: 6,
        width: BASE_WIDTH - 400,
    })

    const TreasureChestContainer = Container(
        {
            x,
            y: BASE_HEIGHT,
            scale: idx === 0 ? 1 : 0,
            name: 'TreasureChestContainer',
            onClick,
        },
        ChestBodySprite,
        ChestLidSprite,
        ChestProgressText,
        ChestProgressSprite
    )

    return TreasureChestContainer
}
