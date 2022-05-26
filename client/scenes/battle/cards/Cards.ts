import type { ROCursor } from 'sbaobab'
import type { BattleScene, CharacterUid } from 'shared'
import type { Datum } from 'datums'
import { DiscardPile } from './DiscardPile'
import { DrawPile } from './DrawPile'
import { Hand } from './Hand'
import {
    BASE_HEIGHT,
    BASE_WIDTH,
    Container,
    getTexture,
    If,
    Sprite,
    Text,
} from '@/elementsUtil'
import type { PixiContainer } from '@/elementsUtil'
import { callApi } from '@/actions'
import { toDatum } from '@/util'

type CardsArgs = {
    scene: ROCursor<BattleScene>
    hoveredCardUid: Datum<CharacterUid | null>
}

export function Cards(args: CardsArgs) {
    const cardsDatum = toDatum(args.scene, scene => {
        if (!scene.isPlayerTurn) return false
        if (scene.state !== 'in battle') return false
        return scene.cards
    })
    return If(
        cardsDatum,
        cards =>
            Container({
                children: [
                    EndTurnButton(),
                    DrawPile(cards['draw']),
                    DiscardPile(cards['discard']),
                    Hand(cards['hand'], args.hoveredCardUid),
                ],
            }),
        undefined,
        { onDestroy: [cardsDatum.destroy] }
    )
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
