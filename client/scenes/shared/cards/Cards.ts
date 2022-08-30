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
} from '@/elementsUtil'
import type { PixiContainer } from '@/elementsUtil'
import { callApi } from '@/callApi'
import { hoveredCharacterUid, toDatum } from '@/util'
import { getBattleScene } from '@/data'

type CardsArgs = {
    scene: ROCursor<BattleScene>
    hoveredCardUid: Datum<CharacterUid | null>
}

export function Cards(args: CardsArgs) {
    const cardsDatum = toDatum(args.scene, scene => {
        if (scene.state !== 'in battle') return false
        return scene.cards
    })
    return If(cardsDatum, cards =>
        Container(
            {},
            EndTurnButton(),
            DrawPile(cards['draw']),
            DiscardPile(cards['discard']),
            Hand(cards['hand'], args.hoveredCardUid)
        )
    )
}

function EndTurnButton(): PixiContainer {
    const buttonTexture = getTexture('endTurnButton')
    return If(
        toDatum(getBattleScene().select('isPlayerTurn'), is => is),
        // toDatum(getBattleScene().select('isPlayerTurn'), () => true), // TEMP!! IMPROPER isPlayerTurn state BUG!!!!
        () =>
            Container(
                {
                    x: BASE_WIDTH * 0.9,
                    y: BASE_HEIGHT * 0.78,
                    onClick: async () => {
                        hoveredCharacterUid.set(null)
                        await callApi('endTurn', {})
                    },
                },

                Sprite({
                    src: buttonTexture,
                    anchor: [0.5, 0.5],
                    scale: (BASE_WIDTH * 0.15) / buttonTexture.width,
                })
                // Text({
                //     text: 'End Turn',
                //     anchor: [0.5, 0.5],
                //     style: {
                //         fill: 0xffffff,
                //         fontSize: 44,
                //         fontFamily: 'bigFont',
                //     },
                // }),
            )
    )
}
