import { Matrix, utils } from 'pixi.js'
import type { ROCursor } from 'sbaobab'
import type { CharacterMeta, CharacterUid } from 'shared'

import { getEffectIconSrc, getTexture } from './logic'
import { callApi } from '@/actions'
import { getBattleScene } from '@/data/rootTree'
import type { PixiContainer, PixiGraphics } from '@/elementsUtil'
import {
    SCALE_UNIVERSAL,
    Container,
    Graphics,
    Sprite,
    Text,
} from '@/elementsUtil'

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
    const mainEl = bindMainEl()
    bindHealthIndicator(characterCursor, mainEl)
    bindStanceIndicator(characterCursor, mainEl)
    bindEffectIndicators(characterCursor, mainEl)
    bindBlockIndicator(characterCursor, mainEl)
    return mainEl
}

function getCharacterCursor(characterUid: string) {
    return getBattleScene().select('allCharacters').select(characterUid)
}

function bindBlockIndicator(
    characterCursor: ROCursor<CharacterMeta>,
    mainEl: PixiContainer
) {
    const container = mainEl.addChild(Container({ children: [] }))

    u()

    characterCursor.select('block').on('update', u)

    function u() {
        container.removeChildren()
        const newBlock = characterCursor.get('block')

        if (newBlock === 0) return

        container.addChild(
            Container({
                // y: -50 *  SCALE_UNIVERSAL,
                x: 200,
                children: [
                    Sprite({
                        src: getTexture('blockIcon'),
                        width: 60 * SCALE_UNIVERSAL,
                        height: 60 * SCALE_UNIVERSAL,
                        anchor: [0.5, 0.5],
                    }),
                    Text({
                        text: `${newBlock}`,
                        anchor: [0.5, 0.5],
                        style: {
                            // fontFamily: ['VT323', 'monospace'],
                            fontFamily: ['monospace'],
                            fontSize: 22,
                            fill: '#eee',
                            stroke: '#666',
                            strokeThickness: 5,
                        },
                    }),
                ],
            })
        )
    }
}

function bindEffectIndicators(
    characterCursor: ROCursor<CharacterMeta>,
    mainEl: PixiContainer
) {
    const container = mainEl.addChild(Container({ children: [] }))

    updateEffects()

    characterCursor.select('effects').on('update', () => {
        updateEffects()
    })

    function updateEffects() {
        container.removeChildren()

        let numMatchedEffects = 0

        const effects = (characterCursor.select('effects').get() ?? []).map(
            (e, i) => {
                let text = Text({
                    text: `${e.type} ${e.remainingRounds} round${
                        e.remainingRounds > 1 ? 's' : ''
                    }`,
                    y: 40 * i - numMatchedEffects,
                    style: {
                        fontFamily: 'monospace',
                        fontSize: 30,
                        fill: 'rgba(255,255,255,.6)',
                        letterSpacing: -5,
                    },
                })
                let icon
                const iconSrc = getEffectIconSrc(e.type)
                if (iconSrc != null) {
                    icon = Sprite({
                        src: iconSrc,
                        width: 80 * SCALE_UNIVERSAL,
                        height: 80 * SCALE_UNIVERSAL,
                        anchor: [0.5, 0.4],
                    })
                    text = Text({
                        text: `${e.remainingRounds}`,
                        anchor: [0.6, 1],
                        style: {
                            fontFamily: ['VT323', 'monospace'],
                            fontSize: 30 * SCALE_UNIVERSAL,
                            fill: 'white',
                            stroke: 'black',
                            strokeThickness: 5,
                        },
                    })
                    ++numMatchedEffects
                }

                return Container({
                    y: 50 * SCALE_UNIVERSAL,
                    x: (numMatchedEffects - 1) * 50 * SCALE_UNIVERSAL,
                    children: [...(icon ? [icon] : []), text],
                })
            }
        )
        if (effects.length) container.addChild(...effects)
    }
}

function bindStanceIndicator(
    characterCursor: ROCursor<CharacterMeta>,
    mainEl: PixiContainer
) {
    const container = mainEl.addChild(Container({ children: [] }))

    updateStance()

    characterCursor.select('stance').on('update', () => {
        updateStance()
    })

    function updateStance() {
        if (!characterCursor.select('isPc').get()) return

        const stance = characterCursor.select('stance').get()

        const stanceSrc =
            stance === 'neutral'
                ? getTexture('stanceNeutral')
                : stance === 'aggressive'
                ? getTexture('stanceAggressive')
                : getTexture('stanceDefensive')

        container.removeChildren()

        container.addChild(
            Sprite({
                src: stanceSrc,
                x: displayWidth,
                y: displayHeight * 1.1,
                anchor: [1, 0],
                width: displayWidth / 3,
                height: (displayWidth / 3 / stanceSrc.width) * stanceSrc.height,
                onClick: () =>
                    callApi('ToggleStance', {
                        characterUid: characterCursor.get('uid'),
                    }),
            })
        )
    }
}

function bindMainEl() {
    return Container({
        name: 'HealthBar',
        x: 0,
        y: 0,
        zIndex: 2,
        children: [],
    })
}

function bindHealthIndicator(
    characterCursor: ROCursor<CharacterMeta>,
    mainEl: PixiContainer
) {
    const container = mainEl.addChild(Container({ children: [] }))

    updateHealth()

    characterCursor.select('health').on('update', () => {
        updateHealth()
    })

    function updateHealth() {
        container.removeChildren()

        // const text = `${char.health} / ${char.maxHealth}`
        const text = `${characterCursor.get('health')}`

        container.addChild(
            Graphics({ draw: g => drawHealthBar(characterCursor, g) }),
            Sprite({
                src: getTexture('healthBorder'),
                width: displayWidth,
                height: displayHeight,
                zIndex: 2,
            }),
            Text({
                text,
                zIndex: 1,
                anchor: [0.5, 0.5],
                x: displayWidth / 2,
                y: displayHeight / 2,
                style: {
                    fontFamily: 'monospace',
                    fontSize: 30,
                    fill: ['#ffeaab', '#f2b600'],
                    stroke: '#333',
                    strokeThickness: 5,
                    letterSpacing: -3,
                },
            })
        )
    }
}

function drawHealthBar(
    characterCursor: ROCursor<CharacterMeta>,
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

    g.beginTextureFill({
        texture: getTexture('healthTexture'),
        color,
        alpha: 1,
        matrix: new Matrix(0.1, 0, 0, 0.1, 0, 0),
    })
    g.drawRect(...rect)

    g.endFill()
}
