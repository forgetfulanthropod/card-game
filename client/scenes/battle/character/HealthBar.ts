import { Rectangle, Texture } from 'pixi.js'
import type { ROCursor } from 'sbaobab'
import type { CharacterMeta, CharacterUid, Effect } from 'shared'

import type { Datum } from 'datums'
import { compose, datum } from 'datums'
import type { VisibleEffect as VisibleEffectId } from '@/assets'
import { getEffectIconSrc, invisibleEffects } from '@/assets'
import { callApi } from '@/callApi'
import { getBattleScene } from '@/data'
import type { PixiContainer, PixiTexture } from '@/elementsUtil'
import {
    For,
    If,
    onDestroyed,
    getTexture,
    SCALE_UNIVERSAL,
    Container,
    Sprite,
    Text,
} from '@/elementsUtil'
import { onUpdate, statChangesDatum, toDatum } from '@/util'
import { ExplanationBox } from '@/scenes/shared'

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

    const isHovered = datum(false)

    const root = Container(
        {
            name: 'HealthBar',
            scale: 0.7,
            onDestroy: [unsub],
        },
        HealthIndicator(characterCursor, isHovered),
        BlockIndicator(characterCursor),
        StanceIndicator(characterCursor, isHovered),
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
                // y: -50 *  SCALE_UNIVERSAL,
                x: characterCursor.get('isPc') ? 275 : -80,
            },
            ...(block === 0
                ? []
                : [
                      Sprite({
                          src: getTexture('blockIcon'),
                          width: 90 * SCALE_UNIVERSAL,
                          height: 90 * SCALE_UNIVERSAL,
                          anchor: [0.5, 0.45],
                      }),
                      Text({
                          text: `${block}`,
                          anchor: [0.5, 0.5],
                          style: {
                              // fontFamily: ['bigFont', 'monospace'],
                              fontFamily: ['sansFont'],
                              fontSize: 28,
                              fill: 'white',
                              stroke: 'black',
                              strokeThickness: 5,
                          },
                      }),
                  ])
        )
    )
}

function EffectIndicators(characterCursor: ROCursor<CharacterMeta>) {
    const effectsCursor = characterCursor.select('effects')
    const data = compose(
        ([statChanges, effects], lastOut) => {
            if (statChanges[characterCursor.get('uid')]?.wait) return lastOut

            return effects
        },
        statChangesDatum,
        toDatum(effectsCursor, effects =>
            effects
                .filter(e => !invisibleEffects.includes(e.id))
                .map(e => ({
                    ...e,
                    key: e.id + e.counter,
                    id: e.id as VisibleEffectId,
                }))
        )
    )

    return For(
        //@ts-expect-error
        data,
        //@ts-expect-error
        effect => InteractiveEffectCounter(effect),
        idx => ({ y: 50 * SCALE_UNIVERSAL, x: idx * 50 * SCALE_UNIVERSAL })
    )
}

function InteractiveEffectCounter(
    effect: Effect & { id: VisibleEffectId }
): PixiContainer {
    return Container(
        {
            name: `Effect-${effect.id}`,
        },
        Sprite({
            src: getEffectIconSrc(effect.id),
            width: 80 * SCALE_UNIVERSAL,
            height: 80 * SCALE_UNIVERSAL,
            anchor: [0.5, 0.4],
        }),
        Text({
            text: `${effect.counter}`,
            anchor: [0.6, 1],
            style: {
                fontFamily: ['bigFont', 'monospace'],
                fontSize: 30 * SCALE_UNIVERSAL,
                fill: 'white',
                stroke: 'black',
                strokeThickness: 5,
            },
        })
    )
}

const STANCE_TEXTS = [
    'Stance modifiers',
    'Aggressive: +25%',
    'Neutral: 0%',
    'Avoidant: -25%',
]

function StanceIndicator(
    characterCursor: ROCursor<CharacterMeta>,
    isHealthBarHovered: Datum<boolean>
) {
    const isHovered = datum(false)
    const data = compose(
        ([stanceData, isHealthBarHovered, isHovered]) => {
            return (isHovered || isHealthBarHovered) && stanceData
        },
        toDatum(characterCursor, ({ isPc, stance, uid }) => {
            if (!isPc) return false
            return { stance, uid }
        }),
        isHealthBarHovered,
        isHovered
    )

    return If(data, ({ stance, uid }) => {
        const stanceSrc =
            stance === 'neutral'
                ? getTexture('stanceNeutral')
                : stance === 'aggressive'
                ? getTexture('stanceAggressive')
                : getTexture('stanceDefensive')

        const width = HEALTH_BAR_WIDTH * 0.27
        const height: number = (width / stanceSrc.width) * stanceSrc.height

        return Container(
            {
                x: HEALTH_BAR_WIDTH * 0.82,
                y:
                    stance === 'aggressive'
                        ? -height * 0.2
                        : stance === 'neutral'
                        ? -height * 0.52
                        : -height * 0.8,
            },
            ExplanationBox({
                texts: STANCE_TEXTS,
                displayObjectArgs: {
                    borderThickness: 2,
                    borderColor: 0x78726a,
                    fontSize: 30,
                    y: height * -0.04,
                    x: width * 0.06,
                },
            }),
            Sprite({
                src: stanceSrc,
                anchor: [1, 0],
                width,
                height,
                events: {
                    pointerover() {
                        isHovered.set(true)
                    },
                    pointerup() {
                        void callApi('toggleStance', { characterUid: uid })
                    },
                    pointerout() {
                        isHovered.set(false)
                    },
                },
            })
        )

        // void nextFrame().then(() => {
        //     const globalPos = root.getGlobalPosition()
        //     portalize({
        //         from: root,
        //         to: () => getStage(),
        //         content: ,
        //     })
        // })

        // return root
    })
}

function StanceBarIndicator(characterCursor: ROCursor<CharacterMeta>) {
    const data = toDatum(characterCursor, ({ isPc, stance, uid }) => {
        if (!isPc) return false
        return { stance, uid }
    })

    return If(data, ({ stance }) => {
        if (stance === 'neutral') {
            return Container({})
        }

        return Sprite({
            src:
                stance === 'aggressive'
                    ? 'healthBarAggressive'
                    : 'healthBarAvoidant',
            anchor: spriteAnchor,
        })
    })
}

function StanceBadge(characterCursor: ROCursor<CharacterMeta>) {
    const data = toDatum(characterCursor, ({ isPc, stance, uid }) => {
        if (!isPc) return false
        return { stance, uid }
    })
    const healthBarTexture = getTexture('healthBarAggressive')

    return If(data, ({ stance }) => {
        return Sprite({
            src:
                stance === 'neutral'
                    ? 'stanceNeutralBadge'
                    : stance === 'aggressive'
                    ? 'stanceAggressiveBadge'
                    : 'stanceDefensiveBadge',
            scale: 0.6,
            x: healthBarTexture.width * 0.9,
            anchor: 0.5,
            alpha: 0.5,
        })
    })
}

const spriteAnchor: [number, number] = [0, 0.5]

function HealthIndicator(
    characterCursor: ROCursor<CharacterMeta>,
    isHovered: Datum<boolean>
) {
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
        StanceBadge(characterCursor),

        // todo: projected damage and DoT
        // ProjectedDamage(characterCursor),
        // ProjectedDoT(characterCursor),

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
                fontSize: 26,
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
        x: originalTexture.width * 0.1,
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
        startingWidth * (portionFrom + 0.1),
        0,
        startingWidth * (portionTo * 0.8),
        startingHeight
    )
    texture.updateUvs()
}
