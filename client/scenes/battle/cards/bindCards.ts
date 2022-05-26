import type { ROCursor } from 'sbaobab'
import type { BattleScene, CharacterUid } from 'shared'
import type { Datum } from 'datums'
import { DiscardPile } from './DiscardPile'
import { DrawPile } from './DrawPile'
import { Hand } from './Hand'
import {
    BASE_HEIGHT,
    BASE_WIDTH,
    clearContainer,
    Container,
    getTexture,
    Sprite,
    Text,
} from '@/elementsUtil'
import type { PixiContainer } from '@/elementsUtil'
import { callApi } from '@/actions'
import { onUpdate } from '@/util'

type BindCursorArgs = {
    scene: ROCursor<BattleScene>
    container: PixiContainer
    hoveredCardUid: Datum<CharacterUid | null>
}

export function bindCards(args: BindCursorArgs): Unbind {
    const u = () => update(args)
    u()
    const { scene } = args
    const unsubs = [
        onUpdate(scene.select('cards'), u),
        onUpdate(scene.select('isPlayerTurn'), u),
        onUpdate(scene.select('state'), u),
    ]
    return () => unsubs.forEach(unsub => unsub())
}

function update({ scene, container, hoveredCardUid }: BindCursorArgs): void {
    clearContainer(container)

    if (!scene.get('isPlayerTurn')) return
    if (scene.get('state') !== 'in battle') return

    const cards = scene.select('cards').get()

    container.addChild(EndTurnButton())
    container.addChild(DrawPile(cards['draw']))
    container.addChild(DiscardPile(cards['discard']))
    container.addChild(Hand(cards['hand'], hoveredCardUid))
}

function EndTurnButton(): PixiContainer {
    return Container({
        x: BASE_WIDTH * 0.9,
        y: BASE_HEIGHT * 0.78,
        onClick: async () => {
            await callApi('EndTurn', {})
        },
        children: [
            Sprite({
                src: getTexture('endTurnButton'),
                anchor: [0.5, 0.5],
                width: BASE_WIDTH * 0.15,
                height:
                    (BASE_WIDTH * 0.15 * getTexture('endTurnButton').height) /
                    getTexture('endTurnButton').width,
            }),
            Text({
                text: 'End Turn',
                anchor: [0.5, 0.5],
                style: {
                    fill: 0xffffff,
                    fontSize: 24,
                    fontFamily: 'bigFont',
                },
            }),
        ],
    })
}
