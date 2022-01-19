import type { BattleScene, Pile } from '@shared'
import type { SCursor } from 'baobab'
import isEqual from 'lodash/isEqual'
import { Loader } from 'pixi.js'

import type { PixiContainer, PixiTexture } from '@/elementsUtil'
import { BASE_HEIGHT, BASE_WIDTH } from '@/elementsUtil'
import { Container, Sprite, Text } from '@/elementsUtil'
import { keys, vals } from '@/util'

type BindCursorArgs = {
    scene: SCursor<BattleScene>
    container: PixiContainer
}

export function bindCards({ scene, container }: BindCursorArgs) {
    updateCards({ scene, container })
    onCursorKeyChange(scene, () => updateCards({ scene, container }))
}

function updateCards({ scene, container }: BindCursorArgs) {
    console.log('UPDATING CARDS')

    const cardsCursor = scene.select('cards')
    const children = container.children
    container.removeChildren()

    for (const x of children) {
        x.destroy()
    }

    const cards = cardsCursor.get()

    container.addChild(DrawPile(cards['draw']))
    container.addChild(DiscardPile(cards['discard']))

    container.addChild(Hand(cards['hand']))
}

function onCursorKeyChange(cursor: SCursor<any>, callback: () => void) {
    let lastKeys = keys(cursor.get())

    cursor.on('update', function checkIfKeysChanged() {
        const newKeys = keys(cursor.get())
        if (!isEqual(lastKeys, newKeys)) {
            lastKeys = newKeys
            callback()
        }
    })
}

function DrawPile(pile: Pile): PixiContainer {
    return Container({
        x: BASE_WIDTH * 0.05,
        y: BASE_HEIGHT * 0.9,
        children: [
            Sprite({
                src: getCardBackSrc(),
                anchor: [0.5, 0.5],
            }),
            Text({
                text: `${vals(pile).length}`,
                anchor: [0.5, 0.5],
                style: {
                    fill: 0xffffff,
                    fontSize: 200,
                },
            }),
        ],
    })
}

function DiscardPile(pile: Pile): PixiContainer {
    return Container({
        x: BASE_WIDTH * 0.95,
        y: BASE_HEIGHT * 0.9,
        children: [
            Sprite({
                src: getCardBackSrc(),
                anchor: [0.5, 0.5],
            }),
            Text({
                text: `${vals(pile).length}`,
                anchor: [0.5, 0.5],
                style: {
                    fill: 0xffffff,
                    fontSize: 200,
                },
            }),
        ],
    })
}

function Hand(pile: Pile): PixiContainer {
    const children = vals(pile).map((card, index) => {
        const scale = 0.5
        return Sprite({
            src: getCardExampleSrc(),
            scale,
            anchor: [0.5, 0.5],
            // pivot: [
            //     (getCardExampleSrc().width / 2) * scale,
            //     (getCardExampleSrc().height / 2) * scale,
            // ],
            ...getXYPivotForNthCard(index + 1, keys(pile).length),
        })
    })

    return Container({
        x: BASE_WIDTH * 0.5,
        y: BASE_HEIGHT * 1,
        children,
    })
}

const RIGHT_TO_LEFT = 1

const MAX_HAND_WIDTH = BASE_WIDTH * 0.6
const MAX_HAND_SIZE = 12
const CARD_WIDTH = (150 * BASE_WIDTH) / 1920
// const CENTER_X = BASE_WIDTH / 2
// const SPREAD_RADIUS = BASE_WIDTH
// const MAX_PIVOT = 0.3 * Math.PI
const MAX_CARD_ROTATION = Math.PI / 3
const Y_MAX_OFFSET = BASE_HEIGHT * 0.06

function getXYPivotForNthCard(
    n: number,
    numCardsInHand: number
): { x: number; y: number; rotation: number } {
    if (n < 1 || n > numCardsInHand)
        throw new Error(`n must be between 1 and numCardsInHand, value: ${n}`)

    const handWidth = Math.min(numCardsInHand * CARD_WIDTH - 15, MAX_HAND_WIDTH)

    // const centerN = (numCardsInHand + 1) / 2

    const xPlacementPortion =
        RIGHT_TO_LEFT * 1 - (2 * (n - 1)) / Math.max(numCardsInHand - 1, 1) // -1 -> 1

    const endCardRotation = (numCardsInHand / MAX_HAND_SIZE) * MAX_CARD_ROTATION

    console.log({
        n,
        xPlacementPortion,
        y:
            -Y_MAX_OFFSET * (1 - Math.abs(xPlacementPortion)) ||
            Y_MAX_OFFSET * 2,
    })

    return {
        x: handWidth * 0.5 * xPlacementPortion,
        y:
            -Y_MAX_OFFSET * (1 - Math.abs(xPlacementPortion)) ||
            Y_MAX_OFFSET / 2,
        rotation: xPlacementPortion * endCardRotation,
    }
}

const getCardBackSrc = () =>
    Loader.shared.resources?.cardBack?.texture as PixiTexture

const getCardExampleSrc = () =>
    Loader.shared.resources?.cardExample?.texture as PixiTexture
