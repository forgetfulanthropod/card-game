import type { BattleScene, Cards, Pile } from '@shared'
import type { SCursor } from 'baobab'

import { endTurn } from '@/actions'
import type { PixiContainer } from '@/elementsUtil'
import { clearContainer } from '@/elementsUtil'
import { BASE_HEIGHT, BASE_WIDTH } from '@/elementsUtil'
import { Container, Sprite, Text } from '@/elementsUtil'
import { onCursorKeyChangeRecursive, vals } from '@/util'

import { getCardBackSrc, getEndTurnButtonSrc, Hand } from './Hand'

type BindCursorArgs = {
    scene: SCursor<BattleScene>
    container: PixiContainer
}

export function bindCards({ scene, container }: BindCursorArgs) {
    update({ scene, container })
    onCursorKeyChangeRecursive<Cards>(scene.select('cards'), () =>
        update({ scene, container })
    )
}

function update({ scene, container }: BindCursorArgs) {
    clearContainer(container)

    const cards = scene.select('cards').get()

    container.addChild(EndTurnButton())
    container.addChild(DrawPile(cards['draw']))
    container.addChild(DiscardPile(cards['discard']))
    container.addChild(Hand(cards['hand']))
}

function EndTurnButton(): PixiContainer {
    return Container({
        x: BASE_WIDTH * 0.9,
        y: BASE_HEIGHT * 0.7,
        onClick: async () => {
            await endTurn({})
        },
        children: [
            Sprite({
                src: getEndTurnButtonSrc(),
                anchor: [0.5, 0.5],
                width: BASE_WIDTH * 0.15,
                height:
                    (BASE_WIDTH * 0.15 * getEndTurnButtonSrc().height) /
                    getEndTurnButtonSrc().width,
            }),
            Text({
                text: 'End Turn',
                anchor: [0.5, 0.5],
                style: {
                    fill: 0xffffff,
                    fontSize: 24,
                    fontFamily: 'VT323',
                },
            }),
        ],
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
                width: getCardBackSrc().width * 0.5,
                height: getCardBackSrc().height * 0.5,
                style: {
                    fill: 0xffffff,
                    fontSize: 150,
                    fontFamily: 'VT323',
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
                width: getCardBackSrc().width * 0.5,
                height: getCardBackSrc().height * 0.5,
                style: {
                    fill: 0xffffff,
                    fontSize: 150,
                    fontFamily: 'VT323',
                },
            }),
        ],
    })
}
