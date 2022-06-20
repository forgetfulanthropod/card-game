import { datum } from 'datums'
import type { ROCursor } from 'sbaobab'
import type {
    CardHit,
    CharacterMeta,
    CharacterUid,
    NetworkDOTData,
    NetworkEvent,
} from 'shared'
import { keys } from 'shared/code'
import { MainCharacterAnimation } from '@sharedElements'
import { HealthBar } from './HealthBar'
import { HitInfo } from './HitInfo'
import { NpcIntentArrow } from './NpcIntentArrow'
import { FloatingIntents } from './FloatingIntents'

import { getOrbTexture, getCharTexture } from '@/assets'
import { onUpdate } from '@/util'
import {
    Adjust,
    Container,
    flashTo,
    SCALE_UNIVERSAL,
    Sprite,
    Text,
} from '@/elementsUtil'
import type { PixiContainer, PixiSpine } from '@/elementsUtil'
import { callApi } from '@/callApi'
import { socketOn } from '@/socket'

const SHOW_HIT_TIME = 1000

type CharacterCursor = ROCursor<CharacterMeta>
interface CharacterProps {
    onClick: (c: CharacterUid) => void
    scale: number
    cursor: ROCursor<CharacterMeta>
}

export function Character(args: CharacterProps): PixiContainer {
    const isHovered = datum(false)
    const characterMeta = args.cursor.get()
    const { screenX, screenY } = characterMeta

    const mainAnimation = MainCharacterAnimation({
        characterMeta,
        events: {
            pointerup: () => args.onClick(characterMeta.uid),
            pointerdown: () => args.onClick(characterMeta.uid),
        },
        centerX: true,
    })

    const mainContainer = Container(
        {
            isHoveredDatum: isHovered,
        },
        Adjust(NpcIntentArrow(characterMeta.uid, isHovered), {
            y: 22,
        }),
        mainAnimation,
        mainAnimation == null &&
            FallBackCharacterSprite(characterMeta, args.onClick),
        Adjust(FloatingIntents(characterMeta.uid), {
            y: -(mainAnimation?.height ?? 0),
        }),
        Adjust(HealthBar(characterMeta.uid), { y: 11 })
    )

    const hitContainer = Container({
        x: 0,
        y: -220,
    })

    const unbindMoves = bindMoves(characterMeta, hitContainer, mainAnimation)
    const unbindDot = bindDOT(characterMeta, hitContainer)

    const root = Container(
        {
            name: 'Character Wrap',
            x: screenX,
            y: screenY,
            // scale: (characterMeta.y / 100) * 0.3 + 0.9,
            scale: 0.3 * 0.3 + 0.9,
            onDestroy: [unbindMoves, unbindDot],
        },

        mainContainer,
        getBoundOrbContainer(args.cursor, mainContainer.height * 0.8),
        hitContainer
    )

    return root
}

function FallBackCharacterSprite(
    characterMeta: CharacterMeta,
    onClick: (_: CharacterUid) => void
) {
    const charSrc = getCharTexture(characterMeta.id)
    return Sprite({
        src: charSrc,
        anchor: [0, 1],
        y: -20,
        events: { pointerup: () => onClick(characterMeta.uid) },
        x: ((characterMeta.isPc ? 1 : -2) * charSrc.width) / 4,
    })
}

function getBoundOrbContainer(
    characterCursor: CharacterCursor,
    offset: number
): PixiContainer {
    const orbContainer = Container({
        x: 0,
        y: -offset,
        name: 'OrbContainer',
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
                    Container(
                        {
                            x: i * orbWidth * 1.5,
                            onClick: async () => {
                                await callApi('activateOrb', {
                                    characterUid: characterCursor.get('uid'),
                                    orb,
                                })
                            },
                        },
                        Sprite({
                            src: getOrbTexture(orb.type),
                            width: orbWidth * SCALE_UNIVERSAL,
                            height: orbWidth * SCALE_UNIVERSAL,
                        }),
                        Text({
                            text: `${orb.remainingCount}`,
                            style: {
                                fontFamily: 'bigFont',
                                fontSize: 14 * SCALE_UNIVERSAL,
                                fill: ['#fff', '#eee'], // gradient
                                // letterSpacing: -5,
                                stroke: '#333',
                                strokeThickness: 5,
                            },
                        })
                    )
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
): Unbind {
    return socketOn('DOT$', handleDOT)
    function handleDOT(event: NetworkEvent<'damage$', NetworkDOTData>) {
        const { damageMap } = event.data

        keys(damageMap).forEach(characterUid => {
            if (characterUid === characterMeta.uid)
                flashPoisonTo(aboveCharacterContainer, damageMap[characterUid])
        })
    }
}

function bindMoves(
    characterMeta: CharacterMeta,
    aboveCharacterContainer: PixiContainer,
    mainAnimation: PixiSpine | null
): Unbind {
    return socketOn('damage$', showCharMove)
    function showCharMove(event: NetworkEvent<'damage$', CardHit>) {
        const { attacker, cardName: _cardName, damages } = event.data
        const defenderUids: CharacterUid[] = Object.keys(damages)

        const thisUid = characterMeta.uid
        if (attacker === thisUid) {
            if (mainAnimation == null) return

            mainAnimation.state.setAnimation(0, 'Attack', false)
            mainAnimation.state.addAnimation(0, 'Idle', true)
        } else if (defenderUids.includes(thisUid)) {
            if (mainAnimation) {
                mainAnimation.state.setAnimation(0, 'Damage', false)
                mainAnimation.state.addAnimation(0, 'Idle', true)
            }

            // flashTo(
            //     aboveCharacterContainer,
            //     () => MoveInfo({ moveName: cardName, offset: -70 }),
            //     {
            //         durationMs: SHOW_HIT_TIME,
            //     }
            // )

            flashDamageTo(aboveCharacterContainer, damages[thisUid])
        }
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

// function makeSprites(
//     args: CharacterProps,
//     characterMeta: CharacterMeta,
//     onHeight: (height: number) => void
// ) {
//     const blurFilter = new filters.BlurFilter()
//     blurFilter.blur = 20
//     const grayFilter = new filters.ColorMatrixFilter()
//     grayFilter.saturate(-0.7, false)
//     const redFilter = new filters.ColorMatrixFilter()
//     redFilter.hue(180, false)

//     const assetIdCursor = args.cursor.select('name')

//     const unsub = onUpdate(assetIdCursor, assetId => {
//         // tl('asset update')
//         // @ts-expect-error TODO
//         if (!hasTexture(assetId)) {
//             unsub()
//             return
//         }
//         const texture = getCharTexture(assetId)
//         const height = texture.height
//         const update = (s: PixiSprite) => {
//             s.texture = texture
//             s.height = height
//         }
//         update(mainSprite)
//         onHeight(height)
//     })

//     if (assetIdCursor.get() == null) {
//         // TODO: has to do with renewChildren()
//         // should never occur...
//         console.error(
//             'null character assetId. probably character was removed or uid was changed.'
//         )
//         unsub()
//         return null
//     }

//     const charSpriteProps = {
//         src: getCharTexture(assetIdCursor.get()),
//         anchor: [0, 1] as [number, number],
//         height: getCharTexture(assetIdCursor.get()).height,
//     }

//     const mainSprite = Sprite({
//         ...charSpriteProps,
//         name: 'mainCharacterSprite',
//         events: {
//             pointerup: () => {
//                 args.onClick(characterMeta.uid)
//             },
//             pointerover: () => {
//                 mainSprite.filters = [glowFilter]
//             },
//             pointerout: () => {
//                 mainSprite.filters = null
//             },
//         },
//         onDestroy: [unsub],
//         zIndex: 1,
//     })

//     return {
//         mainSprite,
//         initialHeight: charSpriteProps.height,
//     }
// }

// const FLY_TIME = 800
// const FLY_TO_TIME = FLY_TIME * 0.6
// const FLY_BACK_TIME = FLY_TIME - FLY_TO_TIME

// function makeFlyToOnTick(start: Point, flyTo: Point, ease = true) {
//     let totalElapsed = 0
//     let flewTo: { x: number; y: number } | null = null
//     const easingFactor = 0.1

//     return (container: PixiContainer, elapsed: number): void | 'remove' => {
//         // const deltaTimeMs = elapsed * 1000 / 60
//         totalElapsed += elapsed * 16.66
//         if (totalElapsed < FLY_TO_TIME) {
//             if (ease) {
//                 container.x += (flyTo.x - container.x) * easingFactor
//                 container.y += (flyTo.y - container.y) * easingFactor
//             } else {
//                 container.x =
//                     start.x + ((flyTo.x - start.x) * totalElapsed) / FLY_TO_TIME
//                 container.y =
//                     start.y + ((flyTo.y - start.y) * totalElapsed) / FLY_TO_TIME
//             }
//         } else if (totalElapsed < FLY_TIME) {
//             if (flewTo == null) flewTo = { x: container.x, y: container.y }

//             container.x =
//                 flewTo.x +
//                 ((start.x - flewTo.x) * (totalElapsed - FLY_TO_TIME)) /
//                     FLY_BACK_TIME
//             container.y =
//                 flewTo.y +
//                 ((start.y - flewTo.y) * (totalElapsed - FLY_TO_TIME)) /
//                     FLY_BACK_TIME
//         } else {
//             container.x = start.x
//             container.y = start.y
//             return 'remove'
//         }
//         return undefined
//     }
// }
