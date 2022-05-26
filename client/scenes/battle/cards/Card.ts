import type { ColorStop } from '@pixi-essentials/gradients'
import { keys, omit } from 'lodash'
import { Tweener } from 'pixi-tweener'
import type { InteractionEvent } from 'pixi.js'
import { Texture } from 'pixi.js'
import type { Card, CardUid, CharacterClass, CharacterUid, Pile } from 'shared'
import type { Datum } from 'datums'
import { beginTargetSelection } from './beginTargetSelection'
import { getCardTypeSrc } from './getCardTypeSrc'
import { assertFinite, hoveredCharacterUid } from '@/util'
import {
    BASE_HEIGHT,
    BASE_WIDTH,
    Container,
    PixiContainer,
    RoundedRectangleGradientSprite,
    Sprite,
    Text,
    TweenableContainer,
} from '@/elementsUtil'
import type {
    InteractionEventHandler,
    InteractionEvents,
    PixiText,
    PixiTexture,
} from '@/elementsUtil'
import { getBattleScene } from '@/data'
import { callApi } from '@/actions'

export const CARD_H_TO_W_RATIO = 630 / 450
export const CARD_WIDTH_IN_HAND = 220
// const CARD_HEIGHT_IN_HAND = CARD_WIDTH_IN_HAND * CARD_H_TO_W_RATIO
export const CARD_WIDTH_FULL = 350
export const CARD_HEIGHT_FULL = CARD_WIDTH_FULL * CARD_H_TO_W_RATIO

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
    hoveredCardUid,
}: // hoveredCardUid,
{
    index: number
    pile: Pile
    card: Card
    name: string
    hoveredCardUid: Datum<CharacterUid | null>
    // hoveredCardUid: string
}) {
    const cardFrameTexture = getCardTypeSrc(card.type)
    const xyrs = getXYRotationScaleForNthCard(
        index + 1,
        keys(pile).length,
        cardFrameTexture
    )
    const colorStops = getColorStopsFromCharacterClass(card.characterClass)

    const root = TweenableContainer({
        // name is card uid
        name,
        // cache: true,
        x: xyrs.x,
        y: xyrs.y,

        children: [
            TweenableContainer({
                events: getEvents(card, hoveredCardUid),
                ...omit(xyrs, 'x', 'y'),
                y: (cardFrameTexture.height / 2) * xyrs.scale,
                children: [
                    getGradientBackground(cardFrameTexture, colorStops),
                    getCardFrameSprite(cardFrameTexture),
                    getEnergyContainer(card, cardFrameTexture),
                    ...getTexts(card, cardFrameTexture, colorStops),
                    PointerAreaExtender(
                        cardFrameTexture.width,
                        cardFrameTexture.height
                    ),
                ],
            }),
        ],
    })

    return root
}

function PointerAreaExtender(width: number, height: number): PixiContainer {
    return Container({
        children: [
            Sprite({
                src: Texture.WHITE,
                width,
                height,
                alpha: 0,
                anchor: [0.5, 0],
            }),
        ],
    })
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

function getCardFrameSprite(cardFrameTexture: PixiTexture) {
    return Sprite({
        src: cardFrameTexture,
        anchor: 0.5,
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
                        { color: 0xee41eb, offset: 0 },
                        { color: 0x432a64, offset: 0.8 },
                        { color: 0x1b081c, offset: 0.88 },
                        // { color: 0xffffff, offset: 0.92 },
                        { color: 0, offset: 1 },
                        // { color: 0x432a64, offset: 0 },
                        // { color: 0x7e4b71, offset: 0.7 },
                        // { color: 0x916367, offset: 0.88 },
                        // { color: 0xfff034, offset: 0.92 },
                        // { color: 0, offset: 1 },
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
                    fontFamily: 'bigFont',
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
                fontFamily: 'bigFont',
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
                fontFamily: 'bigFont',
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
                fontFamily: 'bigFont',
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

let clearLastTargetSelection = () => {}
function getEvents(
    card: Card,
    hoveredCardUid: Datum<CardUid | null>
): InteractionEvents {
    const pointerover: InteractionEventHandler = _ => {
        hoveredCharacterUid.set(card.characterUid)
        hoveredCardUid.set(card.uid)
    }
    const pointerout: InteractionEventHandler = function ({
        currentTarget: cardEl,
    }) {
        setTimeout(() => {
            if (hoveredCardUid.val === cardEl.parent.name) {
                hoveredCardUid.set(null)
            }
        }, 0)
    }
    const pointerdown: InteractionEventHandler = function ({
        currentTarget: cardEl,
    }) {
        //for mobile
        pointerover({
            currentTarget: cardEl,
        } as InteractionEvent)

        if (!(cardEl instanceof PixiContainer))
            throw new Error('ERROR! should be bound to container')

        clearLastTargetSelection()

        if (getBattleScene().get().energy >= card.energy) {
            if (card.targetType !== 'self')
                clearLastTargetSelection = beginTargetSelection(
                    cardEl.parent,
                    card
                )
        }
    }
    const pointerup: InteractionEventHandler = function ({
        currentTarget: cardEl,
    }) {
        if (card.targetType === 'self')
            void callApi('PlayCard', {
                cardUid: card.uid,
                targetUids: [],
            })
        //for mobile
        else
            pointerout({
                currentTarget: cardEl,
            } as InteractionEvent)
    }
    // const pointermove: InteractionEventHandler = function (e) {
    //     console.log({ e })
    //     // if (hasMovedEnough) pointerdown
    // }

    return {
        pointerover,
        pointerout,
        pointerdown,
        pointerup,
        // pointermove,
    }
}

export function getNullAnimation() {
    return Tweener.add({ target: {}, duration: 0 }, {})
}

type XYRotationScale = { x: number; y: number; rotation: number; scale: number }

function getXYRotationScaleForNthCard(
    n: number,
    numCardsInHand: number,
    cardFrameTexture: PixiTexture
): XYRotationScale {
    // circular imports require defining constants here
    const RIGHT_TO_LEFT = 1
    const MAX_HAND_WIDTH = BASE_WIDTH * 0.4
    const MAX_HAND_SIZE = 12
    const CARD_WIDTH = (150 * BASE_WIDTH) / 1920
    const MAX_CARD_ROTATION = Math.PI * 0.1
    const Y_MAX_OFFSET = BASE_HEIGHT * 0.2
    const Y_MIN_OFFSET = BASE_HEIGHT * 0.15

    if (n < 1 || n > numCardsInHand)
        throw new Error(`n must be between 1 and numCardsInHand, value: ${n}`)

    const handWidth = Math.min(
        (numCardsInHand - 1) * CARD_WIDTH,
        MAX_HAND_WIDTH
    )

    const xPlacementPortion =
        RIGHT_TO_LEFT * 1 - (2 * (n - 1)) / Math.max(numCardsInHand - 1, 1) // -1 -> 1

    const endCardRotation =
        ((numCardsInHand - 1) / (MAX_HAND_SIZE - 1)) * MAX_CARD_ROTATION

    return assertFinite({
        x: handWidth * 0.5 * xPlacementPortion,
        y:
            -Y_MIN_OFFSET -
            (Y_MAX_OFFSET - Y_MIN_OFFSET) * (1 - Math.abs(xPlacementPortion)),
        rotation: xPlacementPortion * endCardRotation,
        scale: CARD_WIDTH_IN_HAND / cardFrameTexture.width,
    })
}
