import type { Pile } from '@shared'
// import { myPIXI } from '@/elementsUtil'
import { gsap } from 'gsap'
import { filters, Loader } from 'pixi.js'

import { playCard } from '@/actions'
import type { PixiContainer, PixiTexture } from '@/elementsUtil'
import { BASE_HEIGHT, BASE_WIDTH } from '@/elementsUtil'
import { Container, Sprite } from '@/elementsUtil'
import { keys, vals } from '@/util'

export function Hand(pile: Pile): PixiContainer {
    const cardUids = keys(pile)

    const children = vals(pile).map((card, index) => {
        let animationForCard
        const scale = 0.5
        return Sprite({
            name: cardUids[index],
            src: getCardExampleSrc(),
            scale,
            anchor: [0.5, 0.5],
            onClick: async ({ currentTarget }) => {
                await playCard({ cardUid: currentTarget.name })
            },
            onMouseover: ({ currentTarget }) => {
                currentTarget.filters = [new filters.AlphaFilter(0.7)]

                if (animationForCard != null) animationForCard.kill()
                animationForCard = gsap.to(currentTarget, {
                    pixi: { y: -150 },
                    duration: 0.5,
                })
                // const tween = PIXI.tween.tweenManager.createTween(currentTarget)
                // tween.from({ x: 0 }).to({ x: 250 })
                // tween.time = 1000
                // tween.repeat = 10
                // tween.on('start', () => {
                //     console.log('tween started')
                // })
                // tween.on('repeat', (loopCount: number) => {
                //     console.log('loopCount: ' + loopCount)
                // })
                // tween.start()
            },
            onMouseout: ({ currentTarget }) => {
                currentTarget.filters = []

                if (animationForCard == null) return

                animationForCard.reverse().then(() => animationForCard.kill())
            },
            ...getXYRotationForNthCard(index + 1, keys(pile).length),
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
const getCardExampleSrc = () =>
    Loader.shared.resources?.cardExample?.texture as PixiTexture
