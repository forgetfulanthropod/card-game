import type { ColorStop } from '@pixi-essentials/gradients'
import { omit } from 'lodash'
import type { InteractionEvent } from 'pixi.js'
import { Easing, Tweener } from 'pixi-tweener'
// import { gsap } from 'gsap'
import type { CharacterClass, Pile } from 'shared'
import type { Card } from 'shared'

import { getBattleScene } from '@/data/rootTree'
import type {
    InteractionEventHandler,
    MyPixiContainer,
    PixiText,
    PixiTexture,
} from '@/elementsUtil'
import { TweenableContainer } from '@/elementsUtil'
import { getRenderer } from '@/elementsUtil'
import { Container, PixiContainer } from '@/elementsUtil'
import { BASE_HEIGHT, BASE_WIDTH } from '@/elementsUtil'
import { Sprite, Text } from '@/elementsUtil'
import { RoundedRectangleGradientSprite } from '@/elementsUtil/gradients'
import type { InteractionEvents } from '@/elementsUtil/InteractionEvents'
import { hoveredCardUid, hoveredCharacterUid, keys } from '@/util'

import { getCardTypeSrc } from '../../logic/assetGetters'
import { glowFilter } from '../Character'
import { beginTargetSelection } from './beginTargetSelection'

const CARD_H_TO_W_RATIO = 630 / 450
const CARD_WIDTH_IN_HAND = 220
// const CARD_HEIGHT_IN_HAND = CARD_WIDTH_IN_HAND * CARD_H_TO_W_RATIO
const CARD_WIDTH_FULL = 350
const CARD_HEIGHT_FULL = CARD_WIDTH_FULL * CARD_H_TO_W_RATIO

//maybe yellow/orange gradient for cleric, red for warrior, blue for wizard, green for bard, purple for rogue?
const classToCardColorMap: Record<CharacterClass, [number, number]> = {
    cleric: [0xbce42d, 0xffab44],
    knight: [0xe4a72f, 0xff435a],
    wizard: [0x44a0ff, 0x4d2fe9],
    bard: [0x44ff82, 0x016622],
    rogue: [0xaa44ff, 0x370561],
}

export function Card({
    index,
    pile,
    card,
    name,
}: {
    index: number
    pile: Pile
    card: Card
    name: string
}) {
    const cardFrameTexture = getCardTypeSrc(card.type)
    const xyrs = getXYRotationScaleForNthCard(
        index + 1,
        keys(pile).length,
        cardFrameTexture
    )
    const colorStops = getColorStopsFromCharacterClass(card.characterClass)

    const root = Container({
        name,
        // cache: true,
        ...xyrs,
        children: [
            getGradientBackground(cardFrameTexture, colorStops),
            getCardFrameSprite(
                cardFrameTexture,
                getEvents(card, cardFrameTexture, xyrs)
            ),
            getEnergyContainer(card, cardFrameTexture),
            ...getTexts(card, cardFrameTexture, colorStops),
        ],
    })

    return root
}

function getGradientBackground(
    cardFrameTexture: PixiTexture,
    colorStops: ColorStop[]
) {
    return RoundedRectangleGradientSprite({
        radius: cardFrameTexture.width / 15,
        gradientArgs: {
            x0: 0,
            y0: 0,
            x1: 0,
            y1: cardFrameTexture.height,
            colorStops,
        },
        spriteArgs: {
            width: cardFrameTexture.width,
            height: cardFrameTexture.height,
            anchor: 0.5,
        },
    })
}

function getCardFrameSprite(
    cardFrameTexture: PixiTexture,
    events: InteractionEvents
) {
    return Sprite({
        src: cardFrameTexture,
        anchor: 0.5,
        events,
    })
}

function getEnergyContainer(
    card: Card,
    cardFrameTexture: PixiTexture
): PixiContainer {
    const wh = cardFrameTexture.width / 5
    return Container({
        x: cardFrameTexture.width * 0.498,
        y: -cardFrameTexture.height * 0.498,
        children: [
            RoundedRectangleGradientSprite({
                radius: wh / 2,
                gradientArgs: {
                    y0: wh / 2,
                    x1: wh / 2,
                    x0: wh / 2,
                    y1: wh / 2,
                    r0: 0,
                    r1: wh / 2,
                    colorStops: [
                        { color: 0x432a64, offset: 0 },
                        { color: 0x7e4b71, offset: 0.7 },
                        { color: 0x916367, offset: 0.88 },
                        { color: 0xfff034, offset: 0.92 },
                        { color: 0, offset: 1 },
                    ],
                },
                spriteArgs: {
                    width: wh,
                    height: wh,
                    anchor: 0.5,
                },
            }),
            Text({
                text: `${card.energy}`,
                style: {
                    fill: ['#f3ff30', '#DEBD00', '#D88F00'],
                    stroke: 'black',
                    strokeThickness: 5,
                    fontSize: wh,
                    fontFamily: 'VT323',
                },
                width: ((wh / 2) * BASE_WIDTH) / 1920,
                height: ((wh / 2) * BASE_WIDTH) / 1920,
                anchor: 0.5,
            }),
        ],
    })
}

function getTexts(
    card: Card,
    cardFrameTexture: PixiTexture,
    colorStops: ColorStop[]
): PixiText[] {
    const { marginH, marginV } = getMargins(cardFrameTexture)

    const cardFrameScale = cardFrameTexture.width / 791

    return [
        Text({
            text: card.name,
            y: -cardFrameTexture.height / 2 + marginV,
            anchor: [0.5, 0],
            style: {
                fontSize: 34 * cardFrameScale,
                fontFamily: 'VT323',
                fill: 'white',
                stroke: 'black',
                strokeThickness: 6,
            },
        }),
        Text({
            text: card.explanation,
            x: -cardFrameTexture.width / 2 + marginH,
            y: cardFrameTexture.width * 0.2,
            style: {
                wordWrap: true,
                wordWrapWidth: cardFrameTexture.width - marginH * 2,
                fontSize: 26 * cardFrameScale,
                fontFamily: 'VT323',
                fill: 'black',
                lineHeight: 36,
            },
        }),
        Text({
            text: card.characterClass,
            y: cardFrameTexture.height * 0.45,
            anchor: 0.5,
            style: {
                fontSize: 40 * cardFrameScale,
                fontFamily: 'VT323',
                fill: colorStops[0].color,
                stroke: 'white',
                strokeThickness: 5,
                letterSpacing: 6,
            },
        }),
    ]
}

function getMargins(cardFrameTexture: PixiTexture) {
    const marginH = cardFrameTexture.width / 11
    const marginV = marginH
    return { marginH, marginV }
}

function getColorStopsFromCharacterClass(
    characterClass: CharacterClass
): ColorStop[] {
    const bgGradientColors = classToCardColorMap[characterClass]

    return bgGradientColors.map(
        (color, i): ColorStop => ({
            color,
            offset: i / bgGradientColors.length,
        })
    )
}

function getEvents(
    card: Card,
    cardFrameTexture: PixiTexture,
    xyrs: XYRotationScale
): InteractionEvents {
    let animationForCard = getNullAnimation()
    let expandedCard: MyPixiContainer | null
    const listeners = [
        hoveredCardUid.onChange(uid => {
            if (expandedCard == null || card.uid === uid) return

            pointerout({
                currentTarget: { parent: expandedCard?.parent },
            } as InteractionEvent)
        }),
        hoveredCharacterUid.onChange(uid => {
            if (expandedCard == null || card.characterUid === uid) return

            pointerout({
                currentTarget: { parent: expandedCard?.parent },
            } as InteractionEvent)
        }),
    ]

    const pointerover: InteractionEventHandler = async function ({
        currentTarget: { parent: container },
    }) {
        if (!(container instanceof PixiContainer))
            throw new Error('ERROR! should be bound to container')

        hoveredCharacterUid.set(card.characterUid)
        hoveredCardUid.set(card.uid)

        if (expandedCard == null) {
            expandedCard = TweenableContainer({
                name: `${container.name}-expanded`,
                ...xyrs,
                children: [
                    Sprite({
                        src: getRenderer().generateTexture(container),
                        anchor: 0.5,
                    }),
                ],
            })

            container.on('destroyed', () => {
                listeners.forEach(cb => cb())
            })

            container.parent.addChild(expandedCard)

            expandedCard.filters = [glowFilter]
        }

        container.alpha = 0
        expandedCard.alpha = 1

        await animationForCard
        animationForCard = Tweener.add(
            {
                target: expandedCard,
                duration: 0.3,
                ease: Easing.easeInExpo,
            },
            {
                y: -CARD_HEIGHT_FULL / 2 - 20,
                rotation: 0,
                tweenableScale: CARD_WIDTH_FULL / cardFrameTexture.width,
                // scale: new Point(CARD_WIDTH_FULL / cardFrameTexture.width),
            }
        )
    }
    const pointerout: InteractionEventHandler = async function ({
        currentTarget: { parent: container },
    }) {
        if (!(container instanceof PixiContainer))
            throw new Error('ERROR! should be bound to container')
        if (animationForCard == null || expandedCard == null) return

        await animationForCard
        await (animationForCard = Tweener.add(
            {
                target: expandedCard,
                duration: 0.3,
            },
            {
                ...omit(xyrs, 'scale'),
                tweenableScale: xyrs.scale,
            }
        ))
        container.alpha = 1
        expandedCard.alpha = 0
    }
    const pointerdown: InteractionEventHandler = function ({
        currentTarget: { parent: container },
    }) {
        //for mobile
        pointerover({
            currentTarget: { parent: container },
        } as InteractionEvent)

        if (!(container instanceof PixiContainer))
            throw new Error('ERROR! should be bound to container')

        if (getBattleScene().get().energy >= card.energy) {
            beginTargetSelection(container, card)
        }
    }
    const pointerup: InteractionEventHandler = function ({
        currentTarget: { parent: container },
    }) {
        //for mobile
        pointerout({
            currentTarget: { parent: container },
        } as InteractionEvent)
    }

    return {
        pointerover,
        pointerout,
        pointerdown,
        pointerup,
    }
}

export function getNullAnimation() {
    return Tweener.add({ target: {}, duration: 0 }, {})
}

const RIGHT_TO_LEFT = 1
const MAX_HAND_WIDTH = BASE_WIDTH * 0.4
const MAX_HAND_SIZE = 12
const CARD_WIDTH = (150 * BASE_WIDTH) / 1920
const MAX_CARD_ROTATION = Math.PI * 0.1
const Y_MAX_OFFSET = BASE_HEIGHT * 0.04

type XYRotationScale = { x: number; y: number; rotation: number; scale: number }

function getXYRotationScaleForNthCard(
    n: number,
    numCardsInHand: number,
    cardFrameTexture: PixiTexture
): XYRotationScale {
    if (n < 1 || n > numCardsInHand)
        throw new Error(`n must be between 1 and numCardsInHand, value: ${n}`)

    const handWidth = Math.min(
        (numCardsInHand - 1) * CARD_WIDTH,
        MAX_HAND_WIDTH
    )

    const xPlacementPortion =
        RIGHT_TO_LEFT * 1 - (2 * (n - 1)) / Math.max(numCardsInHand - 1, 1) // -1 -> 1

    // console.log({ xPlacementPortion })

    const endCardRotation =
        ((numCardsInHand - 1) / (MAX_HAND_SIZE - 1)) * MAX_CARD_ROTATION

    return {
        x: handWidth * 0.5 * xPlacementPortion,
        y:
            -Y_MAX_OFFSET * (1 - Math.abs(xPlacementPortion)) ||
            Y_MAX_OFFSET / 8,
        rotation: xPlacementPortion * endCardRotation,
        scale: CARD_WIDTH_IN_HAND / cardFrameTexture.width,
    }
}
