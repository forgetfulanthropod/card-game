import { datum } from 'datums'
import { filters } from 'pixi.js'
import type { ROCursor } from 'sbaobab'
import type {
    CardHit,
    CharacterMeta,
    CharacterUid,
    NetworkDOTData,
    NetworkEvent,
} from 'shared'
import { keys } from 'shared/code'
import { HealthBar } from './HealthBar'
import { HitInfo } from './HitInfo'
import { MoveInfo } from './MoveInfo'
import { ActionIntent } from './ActionIntent'
import { MainCharacterAnimation, getCharTexture, getOrbTexture } from '@/scenes'
import { hoveredCharacterUid, onUpdate } from '@/util'
import {
    Adjust,
    bringToTop,
    Container,
    flashElement,
    flashTo,
    glowFilter,
    hasTexture,
    hideElement,
    PixiTicker,
    SCALE_UNIVERSAL,
    Sprite,
    Text,
} from '@/elementsUtil'
import type { PixiContainer, PixiSpine, PixiSprite } from '@/elementsUtil'
import { getBattleScene } from '@/data'
import { getSocket } from '@/connection'
import { callApi } from '@/actions'

// import LevelUp from './LevelUp'

const RED = 0xff0000
const BLUE = 0x0000ff
const _WHITE = 0xffffff
const SHOW_HIT_TIME = 1000
// const SHOW_LEVEL_UP_TIME = 2000
const ATTACK_ANIMATION_TIME = 1000

type CharacterCursor = ROCursor<CharacterMeta>
interface CharacterProps {
    onClick: (c: CharacterUid) => void
    scale: number
    cursor: ROCursor<CharacterMeta>
    zIndex: number
    isSelected?: boolean
}

export function Character(args: CharacterProps): PixiContainer {
    // NOTE: necessary so the onClick sends the correct data after a character change.
    const characterMeta = { ...args.cursor.get() }
    args.cursor.on('update', () => {
        Object.assign(characterMeta, args.cursor.get())
    })
    const { screenX, screenY } = characterMeta

    // ---Sprites and containers---

    const healthBar = HealthBar(characterMeta.uid)

    const sprites = makeSprites(args, characterMeta, onHeight)
    if (sprites == null) {
        return Container({ children: [] })
    }
    const { attackSprite, defendSprite, mainSprite, initialHeight } = sprites

    const mainAnimation = MainCharacterAnimation(characterMeta, () =>
        args.onClick(characterMeta.uid)
    )

    const unsub = hoveredCharacterUid.onChange(hoveredCharacterUid => {
        if (mainAnimation == null) return
        if (hoveredCharacterUid === characterMeta.uid) {
            mainAnimation.filters = [glowFilter]
        } else {
            mainAnimation.filters = []
        }
    })

    const isHovered = datum(false)
    const mainContainer = Container({
        zIndex: args.zIndex,
        isHoveredDatum: isHovered,
        children: [
            attackSprite,
            defendSprite,
            healthBar,

            Adjust(ActionIntent(characterMeta.uid, isHovered), {
                y: healthBar.height,
            }),
            ...(mainAnimation ? [mainAnimation] : [mainSprite]),
        ],
    })
    mainContainer.sortChildren()

    const hitContainer = Container({
        x: 0,
        y: -initialHeight,
        children: [],
    })

    const flyingContainer = Container({
        name: 'FlyingContainer',
        x: screenX,
        y: screenY,
        children: [
            mainContainer,
            getBoundOrbContainer(args.cursor, mainContainer.height),
            hitContainer,
        ],
        onDestroy: [unsub],
    })

    // ---Functions and listeners---

    function onHeight(height: number) {
        hitContainer.y = -height
    }

    function updateDeathAndHealth() {
        const char = args.cursor.get()
        if (char == null) return

        if (char.health <= 0) {
            flyingContainer.removeChildren()
        }
    }

    args.cursor.select('health').on('update', updateDeathAndHealth)
    args.cursor.select('effects').on('update', updateDeathAndHealth)

    bindDOT(characterMeta, hitContainer)

    bindMoves(
        characterMeta,
        attackSprite,
        healthBar,
        flyingContainer,
        defendSprite,
        hitContainer,
        mainAnimation
    )

    updateDeathAndHealth()

    return flyingContainer
}

function getBoundOrbContainer(
    characterCursor: CharacterCursor,
    offset: number
): PixiContainer {
    const orbContainer = Container({
        x: 0,
        y: -offset,
        name: 'OrbContainer',
        children: [],
    })
    const orbWidth = 45

    const orbsCursor = characterCursor.select('orbs')
    const unsub = onUpdate(
        orbsCursor,
        orbs => {
            if (orbs == null) {
                unsub?.()
                return
            }
            orbContainer.removeChildren()
            orbs.forEach((orb, i) => {
                orbContainer.addChild(
                    Container({
                        x: i * orbWidth * 1.5,
                        onClick: async () => {
                            await callApi('ActivateOrb', {
                                characterUid: characterCursor.get('uid'),
                                orb,
                            })
                        },
                        children: [
                            Sprite({
                                src: getOrbTexture(orb.type),
                                width: orbWidth * SCALE_UNIVERSAL,
                                height: orbWidth * SCALE_UNIVERSAL,
                            }),
                            Text({
                                text: `${orb.remainingCount}`,
                                style: {
                                    fontFamily: 'VT323',
                                    fontSize: 14 * SCALE_UNIVERSAL,
                                    fill: ['#fff', '#eee'], // gradient
                                    // letterSpacing: -5,
                                    stroke: '#333',
                                    strokeThickness: 5,
                                },
                            }),
                        ],
                    })
                )
            })
        },
        true
    )

    return orbContainer
}

function bindDOT(
    characterMeta: CharacterMeta,
    aboveCharacterContainer: PixiContainer
) {
    getSocket().on('DOT$', (event: NetworkEvent<'damage$', NetworkDOTData>) => {
        const { damageMap } = event.data

        keys(damageMap).forEach(characterUid => {
            if (characterUid === characterMeta.uid)
                flashPoisonTo(aboveCharacterContainer, damageMap[characterUid])
        })
    })
}

function bindMoves(
    characterMeta: CharacterMeta,
    attackSprite: PixiSprite,
    healthBar: PixiContainer,
    flyingContainer: PixiContainer,
    defendSprite: PixiSprite,
    aboveCharacterContainer: PixiContainer,
    mainAnimation: PixiSpine | null
) {
    const { screenX, screenY } = characterMeta

    getSocket().on(
        'damage$',
        function showCharMove(event: NetworkEvent<'damage$', CardHit>) {
            const { attacker, cardName, damages } = event.data
            const defenderUids: CharacterUid[] = Object.keys(damages)

            const thisUid = characterMeta.uid
            if (attacker === thisUid) {
                if (mainAnimation) {
                    mainAnimation.state.setAnimation(0, 'Attack', false)
                    mainAnimation.state.addAnimation(0, 'Idle', true)
                    // mainAnimation.state.
                    // mainAnimation.state.addAnimation(0, 'Idle', true)
                    return
                }

                flashElement(attackSprite, {
                    durationMs: ATTACK_ANIMATION_TIME,
                })
                hideElement(healthBar, { durationMs: ATTACK_ANIMATION_TIME })
                const defender0 = getBattleScene().get(
                    'allCharacters',
                    defenderUids[0]
                )

                bringToTop(flyingContainer)

                const fly = makeFlyToOnTick(
                    { x: screenX, y: screenY },
                    { x: defender0.screenX, y: defender0.screenY }
                )
                PixiTicker.shared.add(function cb(dt) {
                    const result = fly(flyingContainer, dt)
                    if (result === 'remove') PixiTicker.shared.remove(cb)
                })
            }

            if (defenderUids.findIndex(d => d === thisUid) > -1) {
                if (mainAnimation) {
                    mainAnimation.state.setAnimation(0, 'Damage', false)
                    mainAnimation.state.addAnimation(0, 'Idle', true)
                } else {
                    flashElement(defendSprite, {
                        durationMs: ATTACK_ANIMATION_TIME,
                    })
                }

                flashTo(
                    aboveCharacterContainer,
                    () => MoveInfo({ moveName: cardName, offset: -70 }),
                    {
                        durationMs: SHOW_HIT_TIME,
                    }
                )

                flashDamageTo(aboveCharacterContainer, damages[thisUid])
            }
        }
    )
}

function makeSprites(
    args: CharacterProps,
    characterMeta: CharacterMeta,
    onHeight: (height: number) => void
) {
    const blurFilter = new filters.BlurFilter()
    blurFilter.blur = 20
    const grayFilter = new filters.ColorMatrixFilter()
    grayFilter.saturate(-0.7, false)
    const redFilter = new filters.ColorMatrixFilter()
    redFilter.hue(180, false)

    const assetIdCursor = args.cursor.select('name')

    const unsub = onUpdate(assetIdCursor, assetId => {
        // tl('asset update')
        // @ts-expect-error TODO
        if (!hasTexture(assetId)) {
            unsub()
            return
        }
        const texture = getCharTexture(assetId)
        const height = texture.height
        const update = (s: PixiSprite) => {
            s.texture = texture
            s.height = height
        }
        update(mainSprite)
        update(defendSprite)
        update(attackSprite)
        onHeight(height)
    })

    if (assetIdCursor.get() == null) {
        // TODO: has to do with renewChildren()
        // should never occur...
        console.error(
            'null character assetId. probably character was removed or uid was changed.'
        )
        unsub()
        return null
    }

    const charSpriteProps = {
        src: getCharTexture(assetIdCursor.get()),
        anchor: [0, 1] as [number, number],
        height: getCharTexture(assetIdCursor.get()).height,
    }

    const mainSprite = Sprite({
        ...charSpriteProps,
        name: 'mainCharacterSprite',
        events: {
            pointerup: () => {
                args.onClick(characterMeta.uid)
            },
            pointerover: () => {
                mainSprite.filters = [glowFilter]
            },
            pointerout: () => {
                mainSprite.filters = []
            },
        },
        onDestroy: [unsub],
        zIndex: 1,
    })
    const defendSprite = Sprite({
        ...charSpriteProps,
        filters: [blurFilter],
        tint: RED,
        zIndex: 0,
        visible: false,
    })
    const attackSprite = Sprite({
        ...charSpriteProps,
        filters: [blurFilter],
        tint: BLUE,
        zIndex: 0,
        visible: false,
    })

    return {
        attackSprite,
        defendSprite,
        mainSprite,
        initialHeight: charSpriteProps.height,
    }
}

const FLY_TIME = 800
const FLY_TO_TIME = FLY_TIME * 0.6
const FLY_BACK_TIME = FLY_TIME - FLY_TO_TIME

function makeFlyToOnTick(start: Point, flyTo: Point, ease = true) {
    let totalElapsed = 0
    let flewTo: { x: number; y: number } | null = null
    const easingFactor = 0.1

    return (container: PixiContainer, elapsed: number): void | 'remove' => {
        // const deltaTimeMs = elapsed * 1000 / 60
        totalElapsed += elapsed * 16.66
        if (totalElapsed < FLY_TO_TIME) {
            if (ease) {
                container.x += (flyTo.x - container.x) * easingFactor
                container.y += (flyTo.y - container.y) * easingFactor
            } else {
                container.x =
                    start.x + ((flyTo.x - start.x) * totalElapsed) / FLY_TO_TIME
                container.y =
                    start.y + ((flyTo.y - start.y) * totalElapsed) / FLY_TO_TIME
            }
        } else if (totalElapsed < FLY_TIME) {
            if (flewTo == null) flewTo = { x: container.x, y: container.y }

            container.x =
                flewTo.x +
                ((start.x - flewTo.x) * (totalElapsed - FLY_TO_TIME)) /
                    FLY_BACK_TIME
            container.y =
                flewTo.y +
                ((start.y - flewTo.y) * (totalElapsed - FLY_TO_TIME)) /
                    FLY_BACK_TIME
        } else {
            container.x = start.x
            container.y = start.y
            return 'remove'
        }
        return undefined
    }
}

function flashPoisonTo(
    aboveCharacterContainer: PixiContainer,
    damage: number
): void {
    flashTo(
        aboveCharacterContainer,
        () => HitInfo({ damage, isPoison: true }),
        {
            durationMs: SHOW_HIT_TIME,
        }
    )
}

function flashDamageTo(
    aboveCharacterContainer: PixiContainer,
    damage: number
): void {
    flashTo(aboveCharacterContainer, () => HitInfo({ damage }), {
        durationMs: SHOW_HIT_TIME,
    })
}
