import type { CharacterUid } from '@shared'
import { Matrix, utils } from 'pixi.js'

import { toggleStance } from '@/actions'
import { getBattleScene } from '@/data/rootTree'

import type { PixiContainer, PixiGraphics, PixiSprite, PixiText } from './mypixi'
import { Container, Graphics, PixiLoader, Sprite, Text } from './mypixi'


type Rect = [
    number, // x
    number, // y
    number, // width
    number, // height
]

export default function HealthBar(characterUid: CharacterUid): PixiContainer {
    const battleScene = getBattleScene()
    const characterCursor = battleScene.select('allCharacters').select(characterUid)
    // if (characterCursor.get() == null) return null

    const displayWidth = 200
    const rawWidth = 1841
    const rawHeight = 161
    const widthToHeight = rawHeight / rawWidth
    const displayHeight = displayWidth * widthToHeight
    const xMargin = .01869158878
    const yMargin = .16883116883
    const colorStops = [
        { color: '#98040c', stop: .2 },
        { color: '#fff133', stop: .4 },
        { color: '#91ff85', stop: 1 },
    ]

    const mainEl = Container({
        name: HealthBar.name,
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

    let health: PixiGraphics
    let healthText: PixiText

    updateHealth()

    characterCursor.select('health').on('update', () => {
        updateHealth()
    })

    function updateHealth() {
        function drawHealthBar(g: PixiGraphics) {
            const portion = characterCursor.select('health').get() / characterCursor.select('maxHealth').get()
            const background = ([...colorStops]
                .sort((cs1, cs2) => cs1.stop - cs2.stop)
                .find(cs => portion <= cs.stop) || { color: 'pink' }).color
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
                matrix: new Matrix(.1, 0, 0, .1, 0, 0),
            })
            g.drawRect(...rect)

            g.endFill()
        }

        if (health != null && healthText != null) mainEl.removeChild(health, healthText)

        const text = characterCursor.select('health').get()?.toString()

        health = Graphics({ draw: drawHealthBar })
        healthText = Text({
            text,
            zIndex: 1,
            anchor: [0, 1],
            style: {
                fontFamily: 'monospace',
                fontSize: 30,
                fill: ['#ffeaab', '#f2b600'], // gradient
                letterSpacing: -5,
            },
        })

        mainEl.addChild(health, healthText)

        mainEl.sortChildren()
    }

    let stanceEl: PixiSprite

    updateStance()

    characterCursor.select('stance').on('update', () => {
        updateStance()
    })

    function updateStance() {
        if (!characterCursor.select('isPc').get()) return

        const stance = characterCursor.select('stance').get()

        const stanceSrc = stance === 'neutral' ? PixiLoader.shared.resources?.stanceNeutral?.data :
            stance === 'aggressive' ? PixiLoader.shared.resources?.stanceAggressive?.data :
                PixiLoader.shared.resources?.stanceDefensive?.data // stance === 'defensive'

        if (stanceEl != null) mainEl.removeChild(stanceEl)
        stanceEl = Sprite({
            src: stanceSrc,
            x: displayWidth,
            y: displayHeight * 1.1,
            anchor: [1, 0],
            width: displayWidth / 3,
            height: displayWidth / 3 / stanceSrc.width * stanceSrc.height,
            onClick: () => toggleStance({ characterUid: characterUid }),
        })
        mainEl.addChild(stanceEl)
    }

    let effects: PixiContainer

    updateEffects()

    characterCursor.select('effects').on('update', () => {
        updateEffects()
    })

    function updateEffects() {
        mainEl.removeChild(effects)

        effects = Container({
            children: (characterCursor.select('effects').get() ?? []).map(
                (e, i) => Text({
                    text: `effect: ${e.type}, rounds: ${e.remainingRounds}`,
                    y: 40 * (i + 1),
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

    return mainEl
}
