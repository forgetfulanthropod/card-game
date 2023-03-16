import { Rectangle, Texture } from 'pixi.js'

import { ModalBackdrop } from '@sharedElements'
import {
    AssetKey,
    getTexture,
    loopSong,
    PixiContainer,
    playSongOnce,
    RoundedRectangleGradientSprite,
    Text,
    TweenableContainer,
    TweenablePixiContainer,
    fontMap,
} from '@/elementsUtil'
import { BASE_HEIGHT, BASE_WIDTH, Container, Sprite } from '@/elementsUtil'
import { callApi } from '@/callApi'
import { getBattleScene } from '@/data'
import { animateTo } from '../shared/cards/Hand'
import {
    LootFromGame,
    TreasureChestLevel,
    TreasureChestLevelThreshold,
} from 'shared'
import { displayScoreNotification } from '../shared/Notification'
import { upperFirst } from 'lodash'
import { Easing, Tweener } from 'pixi-tweener'
import { collectData } from '@/analytics/collectData'

const ROOM_CLEARED_FINAL_POS = {
    rotation: 0,
    scale: 1,
    x: 0,
    y: -700,
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
            return 'Draft New Card'
        case 'treasureChest':
            return 'Chest'
        case 'gems':
            return 'Gems'
        default:
            return 'Loot'
    }
}

export function EndOfRoom(): PixiContainer {
    const scene = getBattleScene()
    collectData('level_end', {
        room_number: scene.get('numRoomsPassed') + 1,
        room_id: scene.get('currentRoom').uid,
        room_tier: scene.get('currentRoom').category,
        run_id: scene.get('runId'),
    })
    const lootScreenHasOpened = scene.get('lootScreenHasOpened') // used to determine initial positioning of the main container and whether to do the animation
    let currLootItemsX = LOOT_ITEMS_FINAL_POS.x
    let updateProgressBarFill: () => void // assigned to fn from chest when it is displayed, then called async
    let refreshRunScore: () => void
    let lootItems = scene.get('lootEarned')
    let currLootItemName = lootItems[0].name
    let currLootItemCount = lootItems[0].count

    let [currLootItem, ...remainingLootItems] = renderLoot()

    if (currLootItem.name !== 'TreasureChestContainer')
        setTimeout(() => playSongOnce('roomVictoryMusicHooligansBluff'), 0)

    const lootItemsContainer = TweenableContainer(
        {
            x: lootScreenHasOpened
                ? LOOT_ITEMS_FINAL_POS.x
                : LOOT_ITEMS_START_POS.x,
        },
        currLootItem,
        ...remainingLootItems
    )

    const slamAnimateElIntoScreen = async (el: TweenablePixiContainer) => {
        await Tweener.add(
            {
                target: el,
                duration: 1,
                ease: Easing.bouncePast,
            },
            {
                alpha: 1,
                tweenableScale: 1,
                x: 0,
                y: 0,
            }
        )
    }

    /** This is a fallback mechanism to do the progress bar fill animation in case the page is refreshed when the treasure chest is the current loot item */
    if (lootItemsContainer.getChildAt(0).name === 'TreasureChestContainer') {
        setTimeout(() => {
            refreshRunScore()
            updateProgressBarFill()
            applyOnClick(
                lootItemsContainer.getChildAt(0) as PixiContainer,
                () => handleButtonPress()
            )
        }, 1000)
    }

    const roomClearedSign = TweenableContainer(
        {
            alpha: lootScreenHasOpened ? 1 : 0,
            scale: lootScreenHasOpened ? 1 : 0,
            x: lootScreenHasOpened ? ROOM_CLEARED_FINAL_POS.x : 1950,
            y: lootScreenHasOpened ? ROOM_CLEARED_FINAL_POS.y : 1000,
        },
        Sprite({
            src: getTexture('roomClearedSign'),
        })
    )

    if (lootScreenHasOpened === false) {
        slamAnimateElIntoScreen(roomClearedSign)

        setTimeout(() => {
            animateTo(roomClearedSign, ROOM_CLEARED_FINAL_POS)
            animateTo(lootItemsContainer, LOOT_ITEMS_FINAL_POS)
            callApi('openEndOfRoom', {})
        }, 2000)
    }

    function renderLoot() {
        let lootItemsContainerX = -900
        let lootItemsContainerY = BASE_HEIGHT + 100

        return lootItems.map((item, idx) => {
            // Each loot container is created 900 pixels to the right of its neighbor (eg. the previous child in the lootItemsContainer array)
            const lootItemContainerArgs = {
                name: `${item.name}`,
                x: (lootItemsContainerX += 900),
                y: lootItemsContainerY,
                onClick: idx === 0 ? () => handleButtonPress() : () => {},
                idx,
                scale: 0.9,
            }
            let itemSrc = item.name

            if (item.name === 'treasureChest') {
                const treasureChest = TreasureChest(lootItemContainerArgs)
                updateProgressBarFill = treasureChest.updateProgressBarFill
                refreshRunScore = treasureChest.refreshRunScore
                return treasureChest.TreasureChestContainer
            }

            // Adjust a bunch of properties manually to adjust for inconsistencies in asset sizing, naming and scaling
            const scale = getScale({ idx })
            let properItemName = getDisplayName(item.name)
            let lootItemTextY = -250 * scale
            let lootItemSpriteY =
                lootItemTextY +
                getTexture(itemSrc as AssetKey).height * (2 * scale) -
                50

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
                gems: {
                    scale: 1.75 * scale,
                    y: lootItemSpriteY - 200 + idx * 75,
                },
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
                src: getTexture(itemSrc as AssetKey),
                scale: itemPositionMap[item.name].scale,
                anchor: [0.5, 0.5],
                x: 0,
                y: itemPositionMap[item.name].y,
                name: 'LootItemSprite',
            })

            const LootItemText = Text({
                text:
                    item.name === 'draftCard'
                        ? properItemName
                        : `Collect ${item.count} ${properItemName}`,
                anchor: [0.5, 0],
                x: 0,
                y: lootItemTextY,
                style: {
                    fontSize: 50 * scale,
                    fill: 'white',
                    padding: 4,
                    align: 'center',
                    fontWeight: 'bold',
                    fontFamily: fontMap['bigFont'],
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

            const confirmTexture = getTexture('confirmButton')

            const ConfirmButton = Sprite({
                // x: (-confirmTexture.width / 2) * 1.25,
                x: 0,
                y: BASE_HEIGHT / 2 + 200,
                src: confirmTexture,
                anchor: [0.5, 0.5],
                scale: 1.25,
                onClick: () => {},
            })

            const skipTexture = getTexture('skipButton')

            const SkipButton = Sprite({
                x: ConfirmButton.x + skipTexture.width * 1.25,
                y: ConfirmButton.y,
                src: skipTexture,
                scale: ConfirmButton.scale.x,
                anchor: [0.5, 0.5],
                onClick: () => {},
            })

            const lootItemContainerChildren = [
                RoundedBlackRectBackground,
                LootItemSprite,
                LootItemText,
            ]

            if (idx === 0) lootItemContainerChildren.push(ConfirmButton)
            else lootItemContainerChildren.push(InactiveLootItemOverlay)

            return Container(
                lootItemContainerArgs,
                ...lootItemContainerChildren
            )
        })
    }

    function handleButtonPress() {
        callApi('collectLoot', {})
        lootItems = scene.get('lootEarned')
        currLootItemName = lootItems[0].name
        currLootItemCount = lootItems[0].count

        if (!['draftCard', 'treasureChest'].includes(currLootItemName)) {
            // this condition prevents flash of draft card icon shifting when it's not supposed to
            displayScoreNotification(
                `Collected ${upperFirst(currLootItemName)}`,
                currLootItemName as AssetKey,
                currLootItemCount
            )
            shiftCurrentItem(lootItemsContainer)
        }
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
                refreshRunScore()
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
        currLootItem = el
    }

    function applyOnClick(
        el: PixiContainer | TweenablePixiContainer,
        onClick: () => void
    ) {
        el.interactive = true
        el.cursor = `url('assets/root/hand.webp'), pointer`
        el.on('pointerdown', onClick)
    }

    const EndOfRoomContainer = Container(
        { x: 0, y: 0, scale: 0.5, name: 'EndOfRoom' },
        ModalBackdrop(),
        lootItemsContainer,
        roomClearedSign
    )

    return EndOfRoomContainer
}

function TreasureChest(args: { x: number; onClick: () => void; idx: number }) {
    const { x, onClick, idx } = args
    const chestBodySrc = getTexture('chestBody')
    const chestLidSrc = getTexture('chestLid')
    const progressBarBackingSrc = getTexture('healthBarBacking')
    const progressBarFillSrc = new Texture(
        getTexture('healthBarHealth').baseTexture
    )

    const battleScene = getBattleScene()
    const { progressPct, upgraded, level } = battleScene.get('treasureChest')
    let { totalScore: currRunScore } = battleScene.get('runScore')
    const refreshRunScore = () => {
        currRunScore = battleScene.get('runScore').totalScore
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
        const partialWidth =
            totalWidth * (progressPct + 0.11) > totalWidth / 2
                ? totalWidth * (progressPct - 0.01)
                : totalWidth * (progressPct + 0.11)

        progressBarFillSrc.frame = new Rectangle(
            0,
            0,
            partialWidth,
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
        y: 565,
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
        text: `${(
            TreasureChestLevelThreshold[(level + 1) as TreasureChestLevel] -
            currRunScore
        ).toFixed(0)} points to reach level ${level + 1}`,
        anchor: [0.5, 0.5],
        x: 0,
        y: 665,
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

    return { TreasureChestContainer, updateProgressBarFill, refreshRunScore }
}
