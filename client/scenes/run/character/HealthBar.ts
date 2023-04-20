import { Rectangle, Texture } from 'pixi.js'
import type { ROCursor } from 'sbaobab'
import type {
    EffectId,
    CharacterMeta,
    CharacterUid,
    Pile,
    BattleScene,
} from 'shared'

import { getBattleScene } from '@/data'
import {
    Adjust,
    AssetKey,
    Container,
    customGlowFilter,
    fontMap,
    getTexture,
    If,
    onDestroyed,
    PixiContainer,
    PixiTexture,
    Sprite,
    Text,
} from '@/elementsUtil'
import {
    globalShowSims,
    hoveredCharacterUid,
    selectedForTargetingCardUid,
    onUpdate,
    statChangesDatum,
    toDatum,
} from '@/util'
import { compose, datum } from 'datums'
import { upperFirst } from 'lodash'
import { EffectIndicators } from './EffectIndicators'
import { StanceControls } from './StanceControls'
import { getClientEnv } from '@/util/getClientEnv'
import { calculateTaunt } from 'shared/code'

export const HEALTH_BAR_WIDTH = 300
// const rawWidth = 1841
// const rawHeight = 161
// const widthToHeight = rawHeight / rawWidth
// const displayHeight = HEALTH_BAR_WIDTH * widthToHeight

export function HealthBar(characterUid: CharacterUid): PixiContainer {
    const characterCursor = getCharacterCursor(characterUid)
    const handCursor = getBattleScene().select('cards', 'hand')
    const sceneCursor = getBattleScene()
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
        DamageIndicator(characterCursor, handCursor),
        getClientEnv('IS_PRODUCTION') === 'true'
            ? null
            : TauntIndicator(sceneCursor, characterCursor)
    )
    return root
}

function getCharacterCursor(characterUid: string) {
    return getBattleScene().select('allCharacters').select(characterUid)
}

function TauntIndicator(
    sceneCursor: ROCursor<BattleScene>,
    characterCursor: ROCursor<CharacterMeta>
) {
    const currentUid = characterCursor.get('uid')
    const data = toDatum(sceneCursor, sc => {
        let t = -1
        const allTaunt = Object.values(sc.allCharacters)
            .filter(cm => cm.isPc && cm.health > 0)
            .map(cm => {
                const x = calculateTaunt(cm, 'current')
                if (cm.uid === currentUid) t = x
                return x
            })
            .reduce((prev, cur) => prev + cur, 0)
        return t != -1 ? `${t} (${((t / allTaunt) * 100).toFixed(2)}%)` : ''
    })
    return If(data, taunt =>
        Container(
            {
                y: -300,
                x: -100,
            },
            ...(taunt === ''
                ? []
                : [
                      Text({
                          text: `${taunt}`,
                          anchor: [0.5, 0.5],
                          style: {
                              fontFamily: fontMap['sansFont'],
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
                              fontFamily: fontMap['sansFont'],
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

const StatChangeText = (
    stat: 'health' | 'block',
    text: string,
    add?: boolean
) => {
    const glowColor = stat === 'health' ? 0x47160b : 0xe1e9f4
    const fill = stat === 'health' ? (add ? 0x69b223 : 0xc23c1e) : 0xbbbdc9
    const customFilter = customGlowFilter(glowColor)

    return Text({
        text,
        anchor: [0.5, 0],
        filters: [customFilter],
        style: {
            fontFamily: fontMap['bigFont'],
            fontSize: text === 'SMASHED' ? 48 : 64,
            fill,
            stroke: 'black',
            strokeThickness: 8,
        },
        onDestroy: [
            () => {
                customFilter.destroy()
            },
        ],
    })
}

function AttackSimulation(isPc: boolean, health: number, healthChange: number) {
    const attackIsKill = healthChange >= health
    healthChange *= -1
    const healthChangeText =
        healthChange === 0
            ? ''
            : healthChange < 0
            ? `${healthChange}`
            : `+${healthChange}`

    const DeathSkull = Sprite({
        src: getTexture('killConfirmed'),
        scale: 0.75,
        x: -250,
        y: 35,
        anchor: 0,
        filters: [customGlowFilter(0xc23c1e)],
    })

    return Container(
        {
            y: -110,
            x: 85,
        },
        attackIsKill
            ? DeathSkull
            : Adjust(
                  StatChangeText('health', healthChangeText, healthChange > 0),
                  { y: 120 }
              )
    )
}

function BlockSimulation(isPc: boolean, block: number, blockChange: number) {
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
              y: 30,
          }
        : { x: -190, y: 40 }

    return Container(
        {
            y: -110,
            x: 85,
        },
        Adjust(StatChangeText('block', blockText), blockAdjustment)
    )
}

function DamageIndicator(
    characterCursor: ROCursor<CharacterMeta>,
    handCursor: ROCursor<Pile>
) {
    const characterUid = characterCursor.get('uid')
    const isPc = characterCursor.get('isPc')
    const showAttackSimulation = datum(false)
    const showBlockSimulation = datum(false)
    const damageValue = datum(0)
    const blockValue = datum(0)

    return onDestroyed(
        Container(
            {},
            If(showAttackSimulation, () => {
                return AttackSimulation(
                    isPc,
                    characterCursor.get('health'),
                    damageValue.val
                )
            }),
            If(showBlockSimulation, () => {
                return BlockSimulation(
                    isPc,
                    characterCursor.get('block'),
                    blockValue.val
                )
            })
        ),
        // TODO combine/cleanup
        selectedForTargetingCardUid.onChange(cardUid => {
            if (globalShowSims.val === false) {
                showAttackSimulation.set(false)
                showBlockSimulation.set(false)
            }
            if (!cardUid) return
            const card = handCursor.get(cardUid)
            if (!card?.outcomes) return
            const outcome = card.outcomes.outcome || card.outcomes[characterUid]
            if (!outcome) return

            const damage = outcome.damages[characterUid] || 0
            const block = outcome.blocks[characterUid] || 0
            damageValue.set(damage)
            blockValue.set(block)

            if (card.outcomes.outcome) {
                if (outcome.damages[characterUid]) {
                    showAttackSimulation.set(true)
                }
                if (outcome.blocks[characterUid]) {
                    showBlockSimulation.set(true)
                }
            }
            return
        }),
        hoveredCharacterUid.onChange(targetChar => {
            if (globalShowSims.val === false) {
                showAttackSimulation.set(false)
                showBlockSimulation.set(false)
            }
            if (!targetChar) return
            if (!selectedForTargetingCardUid.val) return
            const card = handCursor.get(selectedForTargetingCardUid.val)
            if (!card?.outcomes) return
            const outcome = card.outcomes.outcome || card.outcomes[targetChar]
            if (!outcome) return

            const damage = outcome.damages[characterUid] || 0
            const block = outcome.blocks[characterUid] || 0
            damageValue.set(damage)
            blockValue.set(block)

            if (outcome.damages[characterUid]) {
                showAttackSimulation.set(true)
            }

            if (outcome.blocks[characterUid]) {
                showBlockSimulation.set(true)
            }
        }),
        globalShowSims.onChange(val => {
            if (!val) return
            if (!selectedForTargetingCardUid.val) return
            const card = handCursor.get(selectedForTargetingCardUid.val)
            if (!card?.outcomes) return
            const outcome = card.outcomes.outcome || card.outcomes[characterUid]
            if (!outcome) return

            const damage = outcome.damages[characterUid] || 0
            const block = outcome.blocks[characterUid] || 0
            damageValue.set(damage)
            blockValue.set(block)
            showAttackSimulation.set(false)
            showBlockSimulation.set(false)
            showAttackSimulation.set(true)
            showBlockSimulation.set(true)
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
                pointerenter() {
                    isHovered.set(true)
                },
                pointerdown() {
                    isHovered.set(true)
                },
                pointerleave() {
                    setTimeout(() => isHovered.set(false), 50)
                },
            },
        }),
        Sprite({
            src: 'healthBarShadow',
            anchor: spriteAnchor,
        }),
        // StanceBarIndicator(characterCursor),
        // StanceControls(characterCursor),

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
                fontFamily: fontMap['bigFont'],
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
