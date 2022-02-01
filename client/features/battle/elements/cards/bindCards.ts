import type { BattleScene } from '@shared'
import type { SCursor } from 'baobab'

import { endTurn } from '@/actions'
import type { PixiContainer } from '@/elementsUtil'
import { clearContainer } from '@/elementsUtil'
import { BASE_HEIGHT, BASE_WIDTH } from '@/elementsUtil'
import { Container, Sprite, Text } from '@/elementsUtil'

import { DiscardPile } from './DiscardPile'
import { DrawPile } from './DrawPile'
import { getEndTurnButtonSrc, Hand } from './Hand'

type BindCursorArgs = {
    scene: SCursor<BattleScene>
    container: PixiContainer
}

export function bindCards({ scene, container }: BindCursorArgs) {
    const u = () => update({ scene, container })
    u()
    scene.select('cards').on('update', u)
    scene.select('isPlayerTurn').on('update', u)
    scene.select('state').on('update', u)
}

function update({ scene, container }: BindCursorArgs): void {
    clearContainer(container)

    if (!scene.get('isPlayerTurn')) return
    if (scene.get('state') !== 'in battle') return

    const cards = scene.select('cards').get()

    container.addChild(EndTurnButton())
    container.addChild(DrawPile(cards['draw']))
    container.addChild(DiscardPile(cards['discard']))
    container.addChild(Hand(cards['hand']))
}

function EndTurnButton(): PixiContainer {
    return Container({
        x: BASE_WIDTH * 0.9,
        y: BASE_HEIGHT * 0.78,
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
