import type { BattleScene, Pile } from '@shared'
import type { SCursor } from 'baobab'
import isEqual from 'lodash/isEqual'

import type { PixiContainer } from '@/elementsUtil'
import { BASE_HEIGHT, BASE_WIDTH } from '@/elementsUtil'
import { Container, Sprite, Text } from '@/elementsUtil'
import { vals } from '@/util'

import { getCardBackSrc, Hand } from './Hand'

type BindCursorArgs = {
    scene: SCursor<BattleScene>
    container: PixiContainer
}

export function bindCards({ scene, container }: BindCursorArgs) {
    updateCards({ scene, container })
    onCursorKeyChangeRecursive<BattleScene>(scene, () =>
        updateCards({ scene, container })
    )
}

function updateCards({ scene, container }: BindCursorArgs) {
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

function onCursorKeyChangeRecursive<T>(
    cursor: SCursor<T>,
    callback: () => void
) {
    const lastTree = cursor.get()

    cursor.on('update', function checkIfKeysChanged() {
        if (isEqual(cursor.get(), lastTree)) return

        callback()
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
