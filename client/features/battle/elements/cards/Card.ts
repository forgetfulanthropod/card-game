import type { ColorStop } from '@pixi-essentials/gradients'
import type { CharacterClass, CharacterUid, Pile } from '@shared'
import type { Card } from '@shared'
import { gsap } from 'gsap'

import { playCard } from '@/actions'
import { getBattleScene } from '@/data/rootTree'
import type {
    InteractionEventHandler,
    PixiText,
    PixiTexture,
} from '@/elementsUtil'
import { getRenderer } from '@/elementsUtil'
import { Container, PixiContainer } from '@/elementsUtil'
import { BASE_HEIGHT, BASE_WIDTH } from '@/elementsUtil'
import { Sprite, Text } from '@/elementsUtil'
import { RoundedRectangleGradientSprite } from '@/elementsUtil/gradients'
import { keys, vals } from '@/util'

import { getCardTypeSrc } from '../../logic/assetGetters'

const CARD_H_TO_W_RATIO = 630 / 450
const CARD_WIDTH_IN_HAND = 220
// const CARD_HEIGHT_IN_HAND = CARD_WIDTH_IN_HAND * CARD_H_TO_W_RATIO
const CARD_WIDTH_FULL = 350
const CARD_HEIGHT_FULL = CARD_WIDTH_FULL * CARD_H_TO_W_RATIO

//maybe yellow/orange gradient for cleric, red for warrior, blue for wizard, green for bard, purple for rogue?
const classToCardColorMap: Record<CharacterClass, [number, number]> = {
    cleric: [0xbce42d, 0xffab44],
    warrior: [0xe4a72f, 0xff435a],
    wizard: [0x4d2fe9, 0x44a0ff],
    bard: [0x016622, 0x44ff82],
    rogue: [0x370561, 0xaa44ff],
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

    return Container({
        name,
        // cache: true,
        ...xyrs,
        children: [
            getGradientBackground(cardFrameTexture, colorStops),
            getCardFrameSprite(
                cardFrameTexture,
                getMouseEvents(card, cardFrameTexture, xyrs)
            ),
            getEnergyContainer(card, cardFrameTexture),
            ...getTexts(card, cardFrameTexture, colorStops),
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

function getCardFrameSprite(
    cardFrameTexture: PixiTexture,
    mouseEvents: MouseEvents
) {
    return Sprite({
        src: cardFrameTexture,
        anchor: 0.5,
        ...mouseEvents,
    })
}

function getEnergyContainer(
    card: Card,
    cardFrameTexture: PixiTexture
): PixiContainer {
    const { marginH, marginV } = getMargins(cardFrameTexture)

    const wh = cardFrameTexture.width / 4.2
    return Container({
        x: cardFrameTexture.width / 2 - marginH,
        y: -cardFrameTexture.height / 2 + marginV,
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
                stroke: 'black',
                strokeThickness: 5,
                letterSpacing: 4,
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

type MouseEvents = {
    onMouseover: InteractionEventHandler
    onMouseout: InteractionEventHandler
    onClick: InteractionEventHandler
}

function getMouseEvents(
    card: Card,
    cardFrameTexture: PixiTexture,
    xyrs: XYRotationScale
): MouseEvents {
    let animationForCard = getNullAnimation()
    let expandedCard: PixiContainer | null

    return {
        onMouseover: async ({ currentTarget: { parent: container } }) => {
            if (!(container instanceof PixiContainer))
                throw new Error('ERROR! should be bound to container')

            await animationForCard

            if (expandedCard != null) {
                container.parent.removeChild(expandedCard)
                expandedCard.destroy()
                expandedCard = null
            }

            expandedCard = Container({
                name: `${container.name}-expanded`,
                ...xyrs,
                children: [
                    Sprite({
                        src: getRenderer().generateTexture(container),
                        anchor: 0.5,
                    }),
                ],
            })

            container.alpha = 0
            container.parent.addChild(expandedCard)

            animationForCard = gsap.to(expandedCard, {
                pixi: {
                    y: -CARD_HEIGHT_FULL / 2 - 20,
                    rotation: 0,
                    scale: CARD_WIDTH_FULL / cardFrameTexture.width,
                    // width: CARD_WIDTH_FULL,
                    // height: CARD_HEIGHT_FULL,
                },
                duration: 0.3,
            })
        },
        onMouseout: async ({ currentTarget: { parent: container } }) => {
            if (!(container instanceof PixiContainer))
                throw new Error('ERROR! should be bound to container')
            if (animationForCard == null) return
            await animationForCard.reverse().then(() => {
                animationForCard.kill()
                animationForCard = getNullAnimation()
                container.alpha = 1
                if (expandedCard != null) {
                    container.parent.removeChild(expandedCard)
                    expandedCard.destroy()
                    expandedCard = null
                }
            })
        },
        onClick: async ({ currentTarget: { parent: container } }) => {
            if (!(container instanceof PixiContainer))
                throw new Error('ERROR! should be bound to container')

            let targetUids
            switch (card.targetType) {
                case 'enemies':
                    targetUids = [getFrontEnemyUid()]
                    break
                case 'friends':
                    targetUids = [getFrontFriendUid()]
                    break
            }
            await playCard({
                cardUid: container.name,
                targetUids,
            })
        },
    }
}

function getNullAnimation() {
    return gsap.to({}, 0, {})
}

function getFrontFriendUid(): CharacterUid {
    const frontFriend = vals(getBattleScene().get('allCharacters'))
        .sort((a, b) => b.x - a.x)
        .find(c => c.isPc && c.health > 0)

    if (frontFriend == null) throw new Error('there is no enemy...')

    return frontFriend.uid
}

function getFrontEnemyUid(): CharacterUid {
    const frontEnemy = vals(getBattleScene().get('allCharacters'))
        .sort((a, b) => a.x - b.x)
        .find(c => !c.isPc && c.health > 0)

    if (frontEnemy == null) throw new Error('there is no enemy...')

    return frontEnemy.uid
}

const RIGHT_TO_LEFT = 1
const MAX_HAND_WIDTH = BASE_WIDTH * 0.4
const MAX_HAND_SIZE = 12
const CARD_WIDTH = (150 * BASE_WIDTH) / 1920
const MAX_CARD_ROTATION = Math.PI * 0.1
const Y_MAX_OFFSET = BASE_HEIGHT * 0.04

type XYRotationScale = { x: number; y: number; rotation: number; scale: number }

export function getXYRotationScaleForNthCard(
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
