import { Rectangle, Texture } from 'pixi.js'
import type { ROCursor } from 'sbaobab'
import type { Pile, CharacterMeta, CharacterUid } from 'shared'

import type { Datum } from 'datums'
import { compose, datum } from 'datums'
import { getBattleScene } from '@/data'
import {
    AssetKey,
    customGlowFilter,
    PixiContainer,
    PixiTexture,
} from '@/elementsUtil'
import {
    Adjust,
    If,
    onDestroyed,
    getTexture,
    SCALE_UNIVERSAL,
    Container,
    Sprite,
    Text,
} from '@/elementsUtil'
import {
    hoveredCharacterUid,
    hoveredSelectedCardUid,
    isAttacking,
    onUpdate,
    statChangesDatum,
    toDatum,
} from '@/util'
import { Explanation } from '@/scenes/shared'
import { difference, keys, omit, upperFirst } from 'lodash'
import { StanceControls } from './StanceControls'
import { EffectIndicators } from './EffectIndicators'

export const HEALTH_BAR_WIDTH = 300
// const rawWidth = 1841
// const rawHeight = 161
// const widthToHeight = rawHeight / rawWidth
// const displayHeight = HEALTH_BAR_WIDTH * widthToHeight

export function HealthBar(characterUid: CharacterUid): PixiContainer {
    const characterCursor = getCharacterCursor(characterUid)
    const handCursor = getBattleScene().select('cards', 'hand')
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
        EffectIndicators(characterCursor),
        DamageIndicator(characterCursor, handCursor)
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

function DamageContainer(
    isPc: boolean,
    health: number,
    healthChange: number,
    block: number,
    blockChange: number
) {
    const attackIsKill = healthChange >= health

    const healthChangeText =
        healthChange === 0
            ? ''
            : healthChange > 0
            ? `${-healthChange}`
            : `+${healthChange}`

    const blockText =
        blockChange === 0
            ? ''
            : -blockChange >= block
            ? 'SMASHED'
            : blockChange > 0
            ? `+${blockChange}`
            : `${blockChange}`

    const blockAdjustment = isPc
        ? {
              x: 235,
              y: 40,
          }
        : { x: -190, y: 40 }

    const attackAdjustment = { y: 120 }

    const DeathSkull = Sprite({
        src: getTexture('overkill'),
        scale: 0.4,
        x: -200,
        y: 35,
        anchor: 0,
        filters: [customGlowFilter(0xc23c1e)],
    })

    const StatChangeText = (stat: 'health' | 'block', text: string) => {
        const glowColor = stat === 'health' ? 0x47160b : 0xe1e9f4
        const fill = stat === 'health' ? 0xc23c1e : 0xbbbdc9

        return Text({
            text,
            anchor: [0.5, 0],
            filters: [customGlowFilter(glowColor)],
            style: {
                fontFamily: 'bigFont',
                fontSize: text === 'SMASHED' ? 48 : 64,
                fill,
                stroke: 'black',
                strokeThickness: 8,
            },
        })
    }

    return Container(
        {
            y: -110,
            x: 85,
        },
        Adjust(StatChangeText('block', blockText), blockAdjustment),
        attackIsKill
            ? DeathSkull
            : Adjust(
                  StatChangeText('health', healthChangeText),
                  attackAdjustment
              ),
    )
}

function DamageIndicator(
    characterCursor: ROCursor<CharacterMeta>,
    handCursor: ROCursor<Pile>
) {
    const characterUid = characterCursor.get('uid')
    const isPc = characterCursor.get('isPc')
    const showDamageContainer = datum(false)
    const damageValue = datum(0)
    const blockValue = datum(0)
    return onDestroyed(
        If(showDamageContainer, () => {
            return DamageContainer(
                isPc,
                characterCursor.get('health'),
                damageValue.val,
                characterCursor.get('block'),
                blockValue.val
            )
        }),
        hoveredSelectedCardUid.onChange(cardUid => {
            showDamageContainer.set(false)
            if (!cardUid) {
                if (isAttacking.val) return
                showDamageContainer.set(false)
                damageValue.set(0)
                blockValue.set(0)
                return
            }
            const card = handCursor.get(cardUid)
            if (!card.outcomes) {
                showDamageContainer.set(false)
                return
            }
            let outcome = card.outcomes.outcome || card.outcomes[characterUid]
            const damage = outcome.damages[characterUid] || 0
            const block = outcome.blocks[characterUid] || 0
            damageValue.set(damage)
            blockValue.set(block)
            if (keys(outcome.damages).length > 1) {
                for (let char of keys(outcome.damages)) {
                    if (char === characterUid) {
                        showDamageContainer.set(true)
                    }
                }
            }
            return
        }),
        isAttacking.onChange(attacking => {
            if (!hoveredSelectedCardUid.val && !attacking)
                showDamageContainer.set(false)
        }),
        hoveredCharacterUid.onChange(targetChar => {
            showDamageContainer.set(false)
            if (isAttacking.val && targetChar === characterUid) {
                showDamageContainer.set(true)
            }
        })
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
        const portion = cm.health / cm.calculatedStats.constitution

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
