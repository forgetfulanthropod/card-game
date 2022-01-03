import type { CharacterMeta, CharacterUid } from '@shared'
import type { SCursor } from 'baobab'
import { Matrix, utils } from 'pixi.js'

import { toggleStance } from '@/actions'
import { getBattleScene } from '@/data/rootTree'
import type {
    PixiContainer,
    PixiGraphics,
    PixiSprite,
    PixiText,
} from '@/elementsUtil'
import { Container, Graphics, PixiLoader, Sprite, Text } from '@/elementsUtil'

type Rect = [
    number, // x
    number, // y
    number, // width
    number // height
]

const displayWidth = 200
const rawWidth = 1841
const rawHeight = 161
const widthToHeight = rawHeight / rawWidth
const displayHeight = displayWidth * widthToHeight

export default function HealthBar(characterUid: CharacterUid): PixiContainer {
    const characterCursor = getCharacterCursor(characterUid)
    const mainEl = makeMainEl()
    makeHealthIndicator(characterCursor, mainEl)
    makeStanceIndicator(characterCursor, mainEl)
    makeStanceIndicator(characterCursor, mainEl)
    makeEffectIndicator(characterCursor, mainEl)
    return mainEl
}

function getCharacterCursor(characterUid: string) {
    return getBattleScene().select('allCharacters').select(characterUid)
}

function makeEffectIndicator(
    characterCursor: SCursor<CharacterMeta>,
    mainEl: PixiContainer
) {
    let effects: PixiContainer

    updateEffects()

    characterCursor.select('effects').on('update', () => {
        updateEffects()
    })

    function updateEffects() {
        mainEl.removeChild(effects)

        effects = Container({
            children: (characterCursor.select('effects').get() ?? []).map(
                (e, i) =>
                    Text({
                        text: `effect: ${e.type}, rounds: ${e.remainingRounds}`,
                        y: 50 + 40 * i,
                        style: {
                            fontFamily: 'monospace',
                            fontSize: 30,
                            fill: 'rgba(255,255,255,.6)',
                            letterSpacing: -5,
                        },
                    })
            ),
        })

        if (effects.children.length > 0) mainEl.addChild(effects)
    }
}

function makeStanceIndicator(
    characterCursor: SCursor<CharacterMeta>,
    mainEl: PixiContainer
) {
    let stanceEl: PixiSprite

    updateStance()

    characterCursor.select('stance').on('update', () => {
        updateStance()
    })

    function updateStance() {
        if (!characterCursor.select('isPc').get()) return

        const stance = characterCursor.select('stance').get()

        const stanceSrc =
            stance === 'neutral'
                ? PixiLoader.shared.resources?.stanceNeutral?.data
                : stance === 'aggressive'
                ? PixiLoader.shared.resources?.stanceAggressive?.data
                : PixiLoader.shared.resources?.stanceDefensive?.data // stance === 'defensive'

        if (stanceEl != null) mainEl.removeChild(stanceEl)
        stanceEl = Sprite({
            src: stanceSrc,
            x: displayWidth,
            y: displayHeight * 1.1,
            anchor: [1, 0],
            width: displayWidth / 3,
            height: (displayWidth / 3 / stanceSrc.width) * stanceSrc.height,
            onClick: () =>
                toggleStance({ characterUid: characterCursor.get('uid') }),
        })
        mainEl.addChild(stanceEl)
    }
}

function makeMainEl() {
    return Container({
        name: 'HealthBar',
        x: 0,
        y: 0,
        zIndex: 2,
        children: [
            Sprite({
                src: PixiLoader.shared.resources?.healthBorder?.data,
                width: displayWidth,
                height: displayHeight,
                zIndex: 2,
            }),
        ],
    })
}

function makeHealthIndicator(
    characterCursor: SCursor<CharacterMeta>,
    mainEl: PixiContainer
) {
    let health: PixiGraphics
    let healthText: PixiText

    updateHealth()

    characterCursor.select('health').on('update', () => {
        updateHealth()
    })

    function updateHealth() {
        if (health != null && healthText != null)
            mainEl.removeChild(health, healthText)

        const text = characterCursor.select('health').get()?.toString()

        health = Graphics({ draw: g => drawHealthBar(characterCursor, g) })
        healthText = Text({
            text,
            zIndex: 1,
            anchor: [0, 1],
            style: {
                fontFamily: 'monospace',
                fontSize: 30,
                fill: ['#ffeaab', '#f2b600'],
                letterSpacing: -5,
            },
        })

        mainEl.addChild(health, healthText)
        mainEl.sortChildren()
    }
}

function drawHealthBar(
    characterCursor: SCursor<CharacterMeta>,
    g: PixiGraphics
) {
    const xMargin = 0.01869158878
    const yMargin = 0.16883116883
    const colorStops = [
        { color: '#98040c', stop: 0.2 },
        { color: '#fff133', stop: 0.4 },
        { color: '#91ff85', stop: 1 },
    ]

    const portion =
        characterCursor.select('health').get() /
        characterCursor.select('maxHealth').get()
    const background = (
        [...colorStops]
            .sort((cs1, cs2) => cs1.stop - cs2.stop)
            .find(cs => portion <= cs.stop) || { color: 'pink' }
    ).color
    const rect: Rect = [
        displayWidth * xMargin,
        displayHeight * yMargin,
        portion * displayWidth * (1 - 2 * xMargin),
        displayHeight * (1 - 2 * yMargin),
    ]

    g.clear()
    const color = utils.string2hex(background)
    g.beginFill(color)
    g.drawRect(...rect)
    // const healthTexture =
    // if (isDeluxeLoaded) {
    const texture = PixiLoader.shared.resources?.healthTexture?.texture

    g.beginTextureFill({
        texture,
        color,
        alpha: 1,
        matrix: new Matrix(0.1, 0, 0, 0.1, 0, 0),
    })
    g.drawRect(...rect)

    g.endFill()
}
