import type { Pile } from '@shared'
// import { myPIXI } from '@/elementsUtil'
import { gsap } from 'gsap'
import { filters, Loader } from 'pixi.js'

import { playCard } from '@/actions'
import { getBattleScene } from '@/data/rootTree'
import type { PixiContainer, PixiSprite, PixiTexture } from '@/elementsUtil'
import { BASE_HEIGHT, BASE_WIDTH } from '@/elementsUtil'
import { Container, Sprite } from '@/elementsUtil'
import { keys, vals } from '@/util'

export function Hand(pile: Pile): PixiContainer {
    const cardUids = keys(pile)
    const hideFilter = new filters.AlphaFilter(0)
    const scale = 0.5

    const children = vals(pile).map((card, index) => {
        let animationForCard = gsap.to({}, 0, {})
        let expandedCard: PixiSprite | null
        const XYRotation = getXYRotationForNthCard(index + 1, keys(pile).length)

        return Sprite({
            name: cardUids[index],
            src: getCardExampleSrc(),
            scale,
            anchor: [0.5, 0.5],
            ...XYRotation,
            onClick: async ({ currentTarget }) => {
                await playCard({
                    cardUid: currentTarget.name,
                    targetUids: keys(getBattleScene().get('allCharacters')),
                })
            },
            onMouseover: async ({ currentTarget }) => {
                if (animationForCard != null) await animationForCard

                const parent = currentTarget.parent

                currentTarget.filters = [hideFilter]

                if (expandedCard != null) {
                    parent.removeChild(expandedCard)
                    expandedCard.destroy()
                    expandedCard = null
                }
                expandedCard = Sprite({
                    name: `${cardUids[index]}-expanded`,
                    src: getCardExampleSrc(),
                    scale,
                    anchor: [0.5, 0.5],
                    ...XYRotation,
                })

                parent.addChild(expandedCard)

                animationForCard = gsap.to(expandedCard, {
                    pixi: { y: -350, rotation: 0, scale: 1 },
                    duration: 0.3,
                })
            },
            onMouseout: async ({ currentTarget }) => {
                if (animationForCard == null) return

                await animationForCard.reverse().then(() => {
                    animationForCard.kill()
                    currentTarget.filters = []
                    if (expandedCard != null) {
                        currentTarget.parent.removeChild(expandedCard)
                        expandedCard.destroy()
                        expandedCard = null
                    }
                })
            },
        })
    })

    return Container({
        x: BASE_WIDTH * 0.5,
        y: BASE_HEIGHT * 1,
        children,
    })
}
const RIGHT_TO_LEFT = 1
const MAX_HAND_WIDTH = BASE_WIDTH * 0.4
const MAX_HAND_SIZE = 12
const CARD_WIDTH = (150 * BASE_WIDTH) / 1920
const MAX_CARD_ROTATION = Math.PI * 0.1
const Y_MAX_OFFSET = BASE_HEIGHT * 0.04
function getXYRotationForNthCard(
    n: number,
    numCardsInHand: number
): { x: number; y: number; rotation: number } {
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
    }
}
export const getCardBackSrc = () =>
    Loader.shared.resources?.cardBack?.texture as PixiTexture
export const getEndTurnButtonSrc = () =>
    Loader.shared.resources?.endTurnButton?.texture as PixiTexture
const getCardExampleSrc = () =>
    Loader.shared.resources?.cardExample?.texture as PixiTexture
