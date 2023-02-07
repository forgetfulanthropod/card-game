import {
    BASE_HEIGHT,
    BASE_WIDTH,
    Container,
    getTexture,
    If,
    Sprite,
} from '@/elementsUtil'
import { PixiContainer } from '@/elementsUtil'
import { callApi } from '@/callApi'
import { hoveredCharacterUid, toDatum } from '@/util'
import { getBattleScene } from '@/data'
import { compose } from 'datums'

export function EndTurnButton(): PixiContainer {
    const buttonTexture = getTexture('endTurnButton')
    return If(
        compose(
            ([isPlayerTurn, isInBattle]) => isPlayerTurn && isInBattle,
            toDatum(getBattleScene().select('isPlayerTurn'), is => is),
            toDatum(getBattleScene().select('state'), state => {
                return state === 'in battle'
            })
        ),
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
