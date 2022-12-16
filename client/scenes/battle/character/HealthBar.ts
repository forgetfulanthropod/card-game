import { Rectangle, Texture } from 'pixi.js'
import type { ROCursor } from 'sbaobab'
import type { CharacterMeta, CharacterUid } from 'shared'

import type { Datum } from 'datums'
import { compose, datum } from 'datums'
import { getBattleScene } from '@/data'
import type { AssetKey, PixiContainer, PixiTexture } from '@/elementsUtil'
import {
    If,
    onDestroyed,
    getTexture,
    SCALE_UNIVERSAL,
    Container,
    Sprite,
    Text,
} from '@/elementsUtil'
import { onUpdate, statChangesDatum, toDatum } from '@/util'
import { Explanation } from '@/scenes/shared'
import { difference, omit, upperFirst } from 'lodash'
import { StanceControls } from './StanceControls'
import { EffectIndicators } from './EffectIndicators'

export const HEALTH_BAR_WIDTH = 300
// const rawWidth = 1841
// const rawHeight = 161
// const widthToHeight = rawHeight / rawWidth
// const displayHeight = HEALTH_BAR_WIDTH * widthToHeight

export function HealthBar(characterUid: CharacterUid): PixiContainer {
    const characterCursor = getCharacterCursor(characterUid)
    // Can't currently trust Character to destroy its healthbar when it should, so this is a temporary fix
    const unsub = onUpdate(characterCursor, char => {
        if (char == null) {
            unsub()
            root.destroy({ children: true })
        }
    })

    const root = Container(
        {
            name: 'HealthBar',
            scale: 0.7,
            onDestroy: [unsub],
        },
        BlockIndicator(characterCursor),
        HealthIndicator(characterCursor),
        EffectIndicators(characterCursor)
    )
    return root
}

function getCharacterCursor(characterUid: string) {
    return getBattleScene().select('allCharacters').select(characterUid)
}

function BlockIndicator(characterCursor: ROCursor<CharacterMeta>) {
    const data = compose(
        ([statChanges, block], lastOut) => {
            if (statChanges[characterCursor.get('uid')]?.wait) return lastOut

            return block
        },
        statChangesDatum,
        toDatum(characterCursor.select('block'), b => b)
    )
    return If(data, block =>
        Container(
            {
                y: -90,
                x: characterCursor.get('isPc') ? 325 : -100,
            },
            ...(block === 0
                ? []
                : [
                      Sprite({
                          src: getTexture('blockIcon'),
                          width: 105,
                          height: 105,
                          anchor: [0.5, 0.45],
                      }),
                      Text({
                          text: `${block}`,
                          anchor: [0.5, 0.5],
                          style: {
                              // fontFamily: ['bigFont', 'monospace'],
                              fontFamily: ['sansFont'],
                              fontSize: 30,
                              fill: 'white',
                              stroke: 'black',
                              strokeThickness: 5,
                          },
                      }),
                  ])
        )
    )
}

export const spriteAnchor: [number, number] = [0, 0.5]

function HealthIndicator(characterCursor: ROCursor<CharacterMeta>) {
    const isHovered = datum(false)

    let firstRender = true
    let lastHealth = 0
    return Container(
        {
            x: -HEALTH_BAR_WIDTH * 0.2,
        },

        Sprite({
            src: 'healthBarBacking',
            anchor: spriteAnchor,
        }),
        BaseHealth(characterCursor),
        Sprite({
            src: 'healthBarHighlight',
            anchor: spriteAnchor,
            events: {
                pointerover() {
                    isHovered.set(true)
                },
                pointerdown() {
                    isHovered.set(true)
                },
                pointerout() {
                    setTimeout(() => isHovered.set(false), 50)
                },
            },
        }),
        Sprite({
            src: 'healthBarShadow',
            anchor: spriteAnchor,
        }),
        StanceBarIndicator(characterCursor),
        StanceControls(characterCursor),

        Text({
            text: compose(
                ([statChanges, health]) => {
                    // console.log({ statChanges, health })
                    if (firstRender) {
                        firstRender = false
                        lastHealth = health
                        return health
                    }

                    const statChangesForCharacter =
                        statChanges[characterCursor.get('uid')]

                    if (statChangesForCharacter == null) return lastHealth

                    if (
                        !statChangesForCharacter.wait &&
                        statChangesForCharacter?.health
                    )
                        return (lastHealth = health)

                    return lastHealth
                },
                statChangesDatum,
                toDatum(characterCursor.select('health'), h => h)
            ),
            zIndex: 1,
            anchor: [0.5, 0.6],
            x: HEALTH_BAR_WIDTH / 2,
            style: {
                fontFamily: 'bigFont',
                fontSize: 30,
                fill: 'white',
                stroke: '#111',
                strokeThickness: 4,
                // letterSpacing: -3,
            },
        })
    )
}

function BaseHealth(characterCursor: ROCursor<CharacterMeta>) {
    const originalTexture = getTexture('healthBarHealth')
    const texture = new Texture(originalTexture.baseTexture)
    const el = Sprite({
        src: texture,
        scale: HEALTH_BAR_WIDTH / texture.width,
        anchor: spriteAnchor,
    })

    let lastHealth: number

    updateNoWait(characterCursor.get())

    onDestroyed(el, onUpdate(characterCursor, update, false))
    onDestroyed(el, statChangesDatum.onChange(update))

    return el

    function updateNoWait(cm: CharacterMeta) {
        if (cm == null) return
        const portion = cm.health / cm.constitution

        if (cm.health !== lastHealth) updateFrame(texture, 0, portion)

        lastHealth = characterCursor.get('health')
    }

    function update() {
        const cm = characterCursor.get()
        const sc = statChangesDatum.val

        if (cm?.uid && !sc?.[cm.uid]?.wait && sc[cm.uid]?.health)
            updateNoWait(cm)
    }
}

function updateFrame(
    texture: PixiTexture,
    portionFrom: number,
    portionTo: number
) {
    const textureRef = getTexture('healthBarBacking')
    const startingWidth = textureRef.width
    const startingHeight = textureRef.height

    texture.frame = new Rectangle(
        startingWidth * portionFrom,
        0,
        startingWidth * portionTo,
        startingHeight
    )
    texture.updateUvs()
}

function StanceBarIndicator(characterCursor: ROCursor<CharacterMeta>) {
    const data = toDatum(characterCursor, ({ isPc, stance, uid }) => {
        if (!isPc) return false
        return { stance, uid }
    })

    return If(data, ({ stance }) =>
        Sprite({
            src: `healthBar${upperFirst(stance)}` as AssetKey,
            anchor: spriteAnchor,
        })
    )
}
