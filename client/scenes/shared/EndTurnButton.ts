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
import { GradientButton } from '.'

export function EndTurnButton(): PixiContainer {
    const onClick = async () => {
        hoveredCharacterUid.set(null)
        await callApi('endTurn', {})
    }
    const text = 'End Turn'

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
            GradientButton({
                onClick,
                text,
                fontSize: 40,
                gradientFrom: 0xFF9534,
                gradientTo: 0xEC4F0C,
                borderColor: 0x330004,
                x: BASE_WIDTH * 0.90,
                y: BASE_HEIGHT * 0.78,
            })
    )
}
