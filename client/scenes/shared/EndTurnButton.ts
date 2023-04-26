import {
    BASE_HEIGHT,
    BASE_WIDTH,
    Container,
    flashGlowAndBrightnessTo,
    flashGlowTo,
    getTexture,
    If,
    onDestroyed,
    Sprite,
} from '@/elementsUtil'
import { PixiContainer } from '@/elementsUtil'
import { callApi } from '@/callApi'
import { hoveredCharacterUid, toDatum } from '@/util'
import { getBattleScene } from '@/data'
import { compose } from 'datums'
import { GradientButton } from '.'

function BaseEndTurnButton(): PixiContainer {
    const energyDatum = toDatum(
        getBattleScene().select('energy'),
        energy => energy
    )

    setTimeout(() => {
        RenderedButton.interactive = true
    }, 1500)

    const unsub = energyDatum.onChange(energy => {
        let interval: NodeJS.Timer | null = null
        if (energy === 0) {
            interval = setInterval(() => {
                if (RenderedButton) {
                    if (document.hasFocus()) flashGlowTo(RenderedButton, 0.8)
                } else if (interval) clearInterval(interval)
            }, 2000)
        } else {
            if (!interval) return
            clearInterval(interval)
        }
    })

    const RenderedButton = GradientButton({
        onClick: async () => {
            hoveredCharacterUid.set(null)
            await callApi('endTurn', {})
        },
        text: 'End Turn',
        fontSize: 40,
        gradientFrom: 0xff9534,
        gradientTo: 0xec4f0c,
        outlineColor: 0x330004,
        x: BASE_WIDTH * 0.9,
        y: BASE_HEIGHT * 0.78,
    })

    RenderedButton.interactive = false

    return onDestroyed(RenderedButton, unsub)
}

export function EndTurnButton() {
    const scene = getBattleScene()
    return If(
        compose(
            ([isPlayerTurn, isInBattle]) => isPlayerTurn && isInBattle,
            toDatum(scene.select('isPlayerTurn'), is => is),
            toDatum(scene.select('state'), state => {
                return state === 'in battle'
            })
        ),
        // toDatum(getBattleScene().select('isPlayerTurn'), () => true), // TEMP!! IMPROPER isPlayerTurn state BUG!!!!
        () => BaseEndTurnButton()
    )
}
