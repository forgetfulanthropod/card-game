import { Rectangle, Texture } from 'pixi.js'

import { ModalBackdrop } from '@sharedElements'
import {
    getTexture,
    PixiContainer,
    RoundedRectangleGradientSprite,
    Text,
    TweenableContainer,
    TweenablePixiContainer,
} from '@/elementsUtil'
import { BASE_HEIGHT, BASE_WIDTH, Container, Sprite } from '@/elementsUtil'
import { callApi } from '@/callApi'
import { getBattleScene } from '@/data'
import { animateTo } from '../shared/cards/Hand'
import { LootFromGame } from 'shared'

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
    y: 0,
}

const LOOT_ITEMS_START_POS = {
    x: 5000,
}

const ITEM_BOX_HEIGHT = 650
const ITEM_BOX_WIDTH = 600

const getScale = ({ idx }: { idx: number }) => (idx === 0 ? 1.5 : 1)

const getDisplayName = (name: LootFromGame) => {
    switch (name) {
        case 'fish':
            return 'Fish'
        case 'copper':
            return 'Copper'
        case 'stone':
            return 'Stone'
        case 'gold':
            return 'Gold'
        case 'wood':
            return 'Wood'
        case 'draftCard':
            return 'Draft a Card'
        case 'treasureChest':
            return 'Chest'
        default:
            return 'Loot'
    }
}

export function LootCollector(): PixiContainer {
    const scene = getBattleScene()
    const lootScreenHasOpened = scene.get('lootScreenHasOpened') // used to determine initial positioning of the main container and whether to do the animation
    let currLootItemsX = LOOT_ITEMS_FINAL_POS.x
    let updateProgressBarFill: () => void

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

    if (lootScreenHasOpened === false) {
        setTimeout(() => {
            animateTo(roomClearedSign, ROOM_CLEARED_FINAL_POS)
            animateTo(lootItemsContainer, LOOT_ITEMS_FINAL_POS)
        }, 2000)
    }

    if (lootItemsContainer.getChildAt(0).name === 'TreasureChestContainer') {
        setTimeout(() => {
            updateProgressBarFill()
            applyOnClick(
                lootItemsContainer.getChildAt(0) as PixiContainer,
                () => handleButtonPress()
            )
        }, 1000)
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

    function renderLoot() {
        const lootItems = scene.get('lootEarned')

        let lootItemsContainerX = -900
        let lootItemsContainerY = BASE_HEIGHT + 200

        return lootItems.map((item, idx) => {
            // Each loot container is created 900 pixels to the right of its neighbor (eg. the previous child in the lootItemsContainer array)
            const lootItemContainerArgs = {
                name: `LootItemContainer_${item.name}`,
                x: (lootItemsContainerX += 900),
                y: lootItemsContainerY,
                onClick: idx === 0 ? () => handleButtonPress() : () => {},
                idx,
            }
            let itemSrc = item.name

            if (item.name === 'treasureChest') {
                const treasureChest = TreasureChest(lootItemContainerArgs)
                updateProgressBarFill = treasureChest.updateProgressBarFill
                return treasureChest.TreasureChestContainer
            }

            // Define a bunch of properties manually to adjust for inconsistencies in asset sizing and scaling
            const scale = getScale({ idx })
            let properItemName = getDisplayName(item.name)
            let lootItemTextY = -250 * scale
            let lootItemSpriteY =
                lootItemTextY + getTexture(itemSrc).height * (2 * scale) - 50

            const itemPositionMap: Record<
                LootFromGame | 'default',
                { scale: number; y: number }
            > = {
                draftCard: { scale: 0.45, y: 60 },
                fish: { scale: 1.65 * scale, y: lootItemSpriteY - 40 },
                wood: { scale: 1.75 * scale, y: lootItemSpriteY },
                gold: { scale: 1.75 * scale, y: lootItemSpriteY },
                copper: { scale: 1.75 * scale, y: lootItemSpriteY + 30 },
                treasureChest: { scale: 1.75 * scale, y: lootItemSpriteY },
                stone: { scale: 1.75 * scale, y: lootItemSpriteY - 30 },
                default: { scale: 1.75 * scale, y: lootItemSpriteY },
            }

            const RoundedBlackRectBackground = RoundedRectangleGradientSprite({
                spriteArgs: {
                    width: ITEM_BOX_WIDTH * scale,
                    height: ITEM_BOX_HEIGHT * scale,
                    x: 0,
                    y: 0,
                    name: 'RoundedBlackRectBackground',
                    anchor: [0.5, 0.5],
                    alpha: 0.6,
                    tint: 1,
                },
                radius: 100,
                gradientArgs: {
                    x0: 0,
                    x1: 500,
                    y0: 0,
                    y1: 500,
                    colorStops: [
                        { color: 'black', offset: 0 },
                        { color: 'white', offset: 1 },
                    ],
                },
            })

            const LootItemSprite = Sprite({
                src: getTexture(itemSrc),
                scale: itemPositionMap[item.name].scale,
                anchor: [0.5, 0.5],
                x: 0,
                y: itemPositionMap[item.name].y,
                name: 'LootItemSprite',
            })

            const LootItemText = Text({
                text:
                    item.name === 'draftCard'
                        ? 'Draft a Card'
                        : `Collect ${item.count} ${properItemName}`,
                anchor: [0.5, 0],
                x: 0,
                y: lootItemTextY,
                style: {
                    fontSize: 60 * scale,
                    fill: 'white',
                    padding: 4,
                    align: 'center',
                    fontWeight: 'bold',
                },
                name: 'LootItemText',
            })

            const InactiveLootItemOverlay = RoundedRectangleGradientSprite({
                spriteArgs: {
                    width: ITEM_BOX_WIDTH * scale,
                    height: ITEM_BOX_HEIGHT * scale,
                    x: 0,
                    y: 0,
                    name: 'InactiveLootItemOverlay',
                    anchor: [0.5, 0.5],
                    alpha: 0.6,
                    tint: 1,
                },
                radius: 100,
                gradientArgs: {
                    x0: 0,
                    x1: 500,
                    y0: 0,
                    y1: 500,
                    colorStops: [
                        { color: 'black', offset: 0 },
                        { color: 'white', offset: 1 },
                    ],
                },
            })

            const lootItemContainerChildren = [
                RoundedBlackRectBackground,
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

    function handleButtonPress() {
        callApi('collectLoot', {})
        shiftCurrentItem(lootItemsContainer)
    }

    function shiftCurrentItem(el: TweenablePixiContainer) {
        const itemToRemove = el.getChildAt(0)
        itemToRemove.destroy()
        currLootItemsX = currLootItemsX - 900
        animateTo(el, {
            x: currLootItemsX,
            y: 0,
            scale: 1,
            rotation: 0,
        })

        const newCurrentItem = el.getChildAt(0) as TweenablePixiContainer
        transformIntoCurrentItem(newCurrentItem)
    }

    function transformIntoCurrentItem(el: TweenablePixiContainer) {
        if (el.name === 'TreasureChestContainer') {
            setTimeout(() => {
                el.scale = { x: 1.25, y: 1.25 }
            }, 200)
            setTimeout(() => {
                updateProgressBarFill()
                applyOnClick(el, () => handleButtonPress())
            }, 1000)
            return
        }

        const newScale = getScale({ idx: 0 })
        el.height = ITEM_BOX_HEIGHT * newScale
        el.width = ITEM_BOX_WIDTH * newScale
        el.getChildByName('InactiveLootItemOverlay').destroy()
        applyOnClick(el, () => handleButtonPress())
    }

    function applyOnClick(
        el: PixiContainer | TweenablePixiContainer,
        onClick: () => void
    ) {
        el.interactive = true
        el.cursor = `url('assets/root/hand.webp'), pointer`
        el.on('pointerdown', onClick)
    }

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
    const progressBarBackingSrc = getTexture('healthBarBacking')
    const progressBarFillSrc = new Texture(
        getTexture('healthBarHealth').baseTexture
    )
    const { progressPct, upgraded, level } =
        getBattleScene().get('treasureChest')

    const ChestBody = Sprite({
        src: chestBodySrc,
        anchor: [0.5, 0.5],
        x: 0,
        y: 0,
        name: 'ChestBodySprite',
    })

    const ChestLid = Sprite({
        src: chestLidSrc,
        anchor: [0.5, 0.5],
        x: 0,
        y: -100,
        name: 'ChestLidSprite',
    })

    const ChestProgressText = Text({
        text: `Level ${level}`,
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

    const ChestProgressBarBacking = Sprite({
        src: progressBarBackingSrc,
        anchor: [0, 0.5],
        y: 550,
        scale: 6,
        width: BASE_WIDTH - 400,
    })

    const ChestProgressBarFill = Sprite({
        src: progressBarFillSrc,
        anchor: [1, 0.5],
        y: 550,
        scale: 6,
        width: BASE_WIDTH - 400,
        visible: false,
    })

    const ChestProgressBarContainer = Container(
        {
            pivot: [BASE_WIDTH / 2.5, 0],
            x: 0,
            y: 25,
        },
        ChestProgressBarBacking,
        ChestProgressBarFill
    )

    const updateProgressBarFill = () => {
        const textureRef = getTexture('healthBarBacking')
        const totalWidth = textureRef.width
        const totalHeight = textureRef.height

        progressBarFillSrc.frame = new Rectangle(
            0,
            0,
            totalWidth * progressPct,
            totalHeight
        )

        ChestProgressBarFill.anchor.set(0, 0.5)
        ChestProgressBarFill.visible = true
        ChestProgressPctText.visible = true
        ChestLevelText.visible = true
        ConfirmButton.visible = true
        TreasureChestContainer.on('pointerdown', onClick)

        progressBarFillSrc.updateUvs()

        if (upgraded) {
            LevelUpText.visible = true
            animateTo(LevelUpText, {
                x: 500,
                y: 0,
                scale: 1.25,
                rotation: 0,
            })
        }
    }

    const ChestProgressPctText = Text({
        text: `${(progressPct * 100).toFixed(0)}%`,
        anchor: [0.5, 0.5],
        x: 0,
        y: 555,
        style: {
            fontSize: 40,
            fill: 'white',
            padding: 4,
            align: 'center',
            fontWeight: 'bold',
        },
        visible: false,
        name: 'ChestProgressPctText',
    })

    const ChestLevelText = Text({
        text: `${(272 - 272 * progressPct).toFixed(0)} points to reach level ${
            level + 1
        }`,
        anchor: [0.5, 0.5],
        x: 0,
        y: 655,
        style: {
            fontSize: 30,
            fill: 'white',
            padding: 4,
            align: 'center',
            fontWeight: 'normal',
        },
        visible: false,
        name: 'ChestLevelText',
    })

    const LevelUpText = TweenableContainer(
        { visible: false },
        Text({
            text: `Level up!`,
            anchor: [0.5, 0.5],
            x: 0,
            y: 450,
            style: {
                fontSize: 40,
                fill: 'white',
                padding: 4,
                align: 'center',
                fontWeight: 'bold',
            },
            name: 'ChestLevelText',
        })
    )

    const ConfirmButton = Sprite({
        src: getTexture('confirmButton'),
        x: 750,
        y: 465,
        visible: false,
    })

    const TreasureChestContainer = Container(
        {
            x,
            y: BASE_HEIGHT,
            scale: idx === 0 ? 1.25 : 0,
            name: 'TreasureChestContainer',
        },
        ChestBody,
        ChestLid,
        ChestProgressText,
        ChestProgressBarContainer,
        ChestProgressPctText,
        ChestLevelText,
        LevelUpText,
        ConfirmButton
    )

    return { TreasureChestContainer, updateProgressBarFill }
}
