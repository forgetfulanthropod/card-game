import type { BattleScene, Cards, Pile } from '@shared'
import type { SCursor } from 'baobab'

import type { PixiContainer } from '@/elementsUtil'
import { clearContainer } from '@/elementsUtil'
import { BASE_HEIGHT, BASE_WIDTH } from '@/elementsUtil'
import { Container, Sprite, Text } from '@/elementsUtil'
import { onCursorKeyChangeRecursive, vals } from '@/util'

import { getCardBackSrc, Hand } from './Hand'

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

    container.addChild(DrawPile(cards['draw']))
    container.addChild(DiscardPile(cards['discard']))
    container.addChild(Hand(cards['hand']))
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
