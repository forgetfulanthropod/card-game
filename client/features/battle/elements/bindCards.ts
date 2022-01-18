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

function DrawPile(pile: Pile) {
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

function DiscardPile(pile: Pile) {
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

function Hand(pile: Pile) {
    const children = vals(pile).map(() => {
        return Sprite({
            src: getCardExampleSrc(),
            scale: 0.5,
            anchor: [0.5, 0.5],
        })
    })

    return Container({
        x: BASE_WIDTH * 0.5,
        y: BASE_HEIGHT * 1,
        children,
    })
}

const getCardBackSrc = () =>
    Loader.shared.resources?.cardBack?.texture as PixiTexture

const getCardExampleSrc = () =>
    Loader.shared.resources?.cardExample?.texture as PixiTexture
