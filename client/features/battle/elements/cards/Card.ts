import type { ColorStop } from '@pixi-essentials/gradients'
import type { CharacterClass, CharacterUid, Pile } from '@shared'
import type { Card } from '@shared'
import { gsap } from 'gsap'
import { filters } from 'pixi.js'

import { playCard } from '@/actions'
import { getBattleScene } from '@/data/rootTree'
import type {
    InteractionEventHandler,
    PixiContainer,
    PixiSprite,
    PixiTexture,
} from '@/elementsUtil'
import { Container } from '@/elementsUtil'
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

    return Container({
        name,
        ...getXYRotationScaleForNthCard(
            index + 1,
            keys(pile).length,
            cardFrameTexture
        ),
        children: [
            RoundedRectangleGradientSprite({
                radius: cardFrameTexture.width / 15,
                gradientArgs: {
                    x0: 0,
                    y0: 0,
                    x1: 0,
                    y1: cardFrameTexture.height,
                    colorStops: getColorStopsFromCharacterClass(
                        card.characterClass
                    ),
                },
                spriteArgs: {
                    width: cardFrameTexture.width,
                    height: cardFrameTexture.height,
                    anchor: 0.5,
                },
            }),
            Sprite({
                src: cardFrameTexture,
                anchor: 0.5,
                ...getMouseEvents(card, cardFrameTexture),
            }),
            Sprite({
                src: Text({
                    text: 'asdf1234',
                    style: {
                        fontSize: 100,
                        fontFamily: 'VT323',
                        fill: 'white',
                    },
                }).texture,
                anchor: 0.5,
            }),
        ],
    })
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

function getMouseEvents(
    card: Card,
    cardFrameTexture: PixiTexture
): {
    onMouseover: InteractionEventHandler
    onMouseout: InteractionEventHandler
    onClick: InteractionEventHandler
} {
    const hideFilter = new filters.AlphaFilter(0)
    let animationForCard = getNullAnimation()
    let expandedCard: PixiContainer | null

    return {
        onMouseover: async ({ currentTarget }) => {
            await animationForCard

            const parent = currentTarget.parent

            currentTarget.parent.children.forEach(
                c => (c.filters = [hideFilter])
            )

            if (expandedCard != null) {
                parent.parent.removeChild(expandedCard)
                expandedCard.destroy()
                expandedCard = null
            }

            expandedCard = Container({
                name: `${parent.name}-expanded`,
                scale: [parent.scale._x, parent.scale._y],
                x: parent.x,
                y: parent.y,
                children: parent.children.map(c => {
                    const s = c as PixiSprite
                    return Sprite({
                        src: s.texture,
                        anchor: [s.anchor._x, s.anchor._y],
                    })
                }),
            })

            parent.parent.addChild(expandedCard)

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
        onMouseout: async ({ currentTarget }) => {
            if (animationForCard == null) return

            await animationForCard.reverse().then(() => {
                animationForCard.kill()
                animationForCard = getNullAnimation()
                currentTarget.parent.children.forEach(c => (c.filters = []))
                if (expandedCard != null) {
                    currentTarget.parent.removeChild(expandedCard)
                    expandedCard.destroy()
                    expandedCard = null
                }
            })
        },
        onClick: async ({ currentTarget }) => {
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
                cardUid: currentTarget.name,
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
