import { Matrix, utils } from 'pixi.js'
import type { ROCursor } from 'sbaobab'
import type { CharacterMeta, CharacterUid } from 'shared'

import { getEffectIconSrc } from '@/scenes'
import { callApi } from '@/actions'
import { getBattleScene } from '@/data'
import type { PixiContainer } from '@/elementsUtil'
import {
    clearContainer,
    If,
    onDestroyed,
    PixiGraphics,
    getTexture,
    SCALE_UNIVERSAL,
    Container,
    Sprite,
    Text,
} from '@/elementsUtil'
import { onUpdate, toDatum } from '@/util'

type Rect = [
    number, // x
    number, // y
    number, // width
    number // height
]

export const HEALTH_BAR_WIDTH = 200
const rawWidth = 1841
const rawHeight = 161
const widthToHeight = rawHeight / rawWidth
const displayHeight = HEALTH_BAR_WIDTH * widthToHeight

export function HealthBar(characterUid: CharacterUid): PixiContainer {
    const characterCursor = getCharacterCursor(characterUid)
    return Container({
        name: 'HealthBar',
        x: 0,
        y: 0,
        zIndex: 2,
        children: [
            HealthIndicator(characterCursor),
            StanceIndicator(characterCursor),
            EffectIndicators(characterCursor),
            BlockIndicator(characterCursor),
        ],
    })
}

function getCharacterCursor(characterUid: string) {
    return getBattleScene().select('allCharacters').select(characterUid)
}

function BlockIndicator(characterCursor: ROCursor<CharacterMeta>) {
    const data = toDatum(characterCursor.select('block'), b => b)
    return If(data, block =>
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
                    text: `${block}`,
                    anchor: [0.5, 0.5],
                    style: {
                        // fontFamily: ['bigFont', 'monospace'],
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

function EffectIndicators(characterCursor: ROCursor<CharacterMeta>) {
    const container = Container({
        children: [],
        onDestroy: [onUpdate(characterCursor.select('effects'), updateEffects)],
    })
    return container
    function updateEffects() {
        clearContainer(container)

        let numMatchedEffects = 0

        const effects = (characterCursor.select('effects').get() ?? []).map(
            (e, i) => {
                let text = Text({
                    text: `${e.id} ${e.counter} round${
                        e.counter > 1 ? 's' : ''
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
                const iconSrc = getEffectIconSrc(e.id)
                if (iconSrc != null) {
                    icon = Sprite({
                        src: iconSrc,
                        width: 80 * SCALE_UNIVERSAL,
                        height: 80 * SCALE_UNIVERSAL,
                        anchor: [0.5, 0.4],
                    })
                    text = Text({
                        text: `${e.counter}`,
                        anchor: [0.6, 1],
                        style: {
                            fontFamily: ['bigFont', 'monospace'],
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

function StanceIndicator(characterCursor: ROCursor<CharacterMeta>) {
    const data = toDatum(characterCursor, ({ isPc, stance, uid }) => {
        if (!isPc) return false
        return { stance, uid }
    })
    return If(data, ({ stance, uid }) => {
        const stanceSrc =
            stance === 'neutral'
                ? getTexture('stanceNeutral')
                : stance === 'aggressive'
                ? getTexture('stanceAggressive')
                : getTexture('stanceDefensive')
        return Sprite({
            src: stanceSrc,
            x: HEALTH_BAR_WIDTH,
            y: displayHeight * 1.1,
            anchor: [1, 0],
            width: HEALTH_BAR_WIDTH / 3,
            height: (HEALTH_BAR_WIDTH / 3 / stanceSrc.width) * stanceSrc.height,
            onClick: () => callApi('ToggleStance', { characterUid: uid }),
        })
    })
}

function HealthIndicator(characterCursor: ROCursor<CharacterMeta>) {
    return Container({
        children: [
            HealthBarLine(characterCursor),
            Sprite({
                src: getTexture('healthBorder'),
                width: HEALTH_BAR_WIDTH,
                height: displayHeight,
                zIndex: 2,
            }),
            Text({
                text: characterCursor.select('health'),
                zIndex: 1,
                anchor: [0.5, 0.5],
                x: HEALTH_BAR_WIDTH / 2,
                y: displayHeight / 2,
                style: {
                    fontFamily: 'monospace',
                    fontSize: 30,
                    fill: ['#ffeaab', '#f2b600'],
                    stroke: '#333',
                    strokeThickness: 5,
                    letterSpacing: -3,
                },
            }),
        ],
    })
}

function HealthBarLine(characterCursor: ROCursor<CharacterMeta>) {
    const g = new PixiGraphics()
    g.name = HealthBarLine.name
    const unsub = onUpdate(characterCursor, draw, true)
    onDestroyed(g, unsub)
    return g
    function draw(cm: CharacterMeta) {
        if (cm == null) {
            unsub()
            return
        }
        const xMargin = 0.01869158878
        const yMargin = 0.16883116883
        const colorStops = [
            { color: '#98040c', stop: 0.2 },
            { color: '#fff133', stop: 0.4 },
            { color: '#91ff85', stop: 1 },
        ]

        const portion = cm.health / cm.constitution
        const background = (
            [...colorStops]
                .sort((cs1, cs2) => cs1.stop - cs2.stop)
                .find(cs => portion <= cs.stop) || { color: 'pink' }
        ).color
        const rect: Rect = [
            HEALTH_BAR_WIDTH * xMargin,
            displayHeight * yMargin,
            portion * HEALTH_BAR_WIDTH * (1 - 2 * xMargin),
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
}
