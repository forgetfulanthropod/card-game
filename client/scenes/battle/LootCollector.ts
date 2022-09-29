import { Rectangle, Texture } from 'pixi.js'

import { ModalBackdrop, animateTo } from '@sharedElements'
import type { LootFromGame } from 'shared'
import type { PixiContainer, TweenablePixiContainer } from '@/elementsUtil'
import {
    getTexture,
    Text,
    TweenableContainer,
    BASE_HEIGHT,
    BASE_WIDTH,
    Container,
    Sprite,
} from '@/elementsUtil'
import { callApi } from '@/callApi'
import { getBattleScene } from '@/data'

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

const getDisplayName = (name: LootFromGame) => {
    switch (name) {
        case 'bread':
            return 'Bread'
        case 'fishStick':
            return 'Fish'
        case 'potion':
            return 'Potions'
        case 'swordShield':
            return 'Armor'
        case 'draftCard':
            return 'Draft a Card'
        default:
            return 'Loot'
    }
}

export function LootCollector(): PixiContainer {
    const scene = getBattleScene()
    const lootScreenHasOpened = scene.get('lootScreenHasOpened')
    let currLootItemsX = LOOT_ITEMS_FINAL_POS.x

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
        const lootItemsContainerY = BASE_HEIGHT + 200

        return lootItems.map((item, idx) => {
            const itemSrc = item.name === 'draftCard' ? 'cardBack' : item.name
            const properItemName = getDisplayName(item.name)

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
                        : `Collect \n${item.count} ${properItemName}`,
                anchor: [0.5, 0],
                x: 0,
                y: -(ITEM_BOX_HEIGHT / 2) * scale + (50 + scale),
                style: {
                    fontSize: 70 * scale,
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
    const { progressPct, upgraded } = getBattleScene().get('treasureChest')

    setTimeout(() => {
        updateProgressBarFill()
    }, 750)

    if (upgraded) {
        // do TreasureChest upgrade animation
    }

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

        progressBarFillSrc.updateUvs()
    }

    const TreasureChestContainer = Container(
        {
            x,
            y: BASE_HEIGHT,
            scale: idx === 0 ? 1.25 : 0,
            name: 'TreasureChestContainer',
            onClick,
        },
        ChestBody,
        ChestLid,
        ChestProgressText,
        ChestProgressBarContainer
    )

    return TreasureChestContainer
}
