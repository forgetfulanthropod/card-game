import {
    Adjust,
    Container,
    PixiContainer,
    RoundedRectangleGradientSprite,
    TweenablePixiContainer,
} from '@/elementsUtil'
import 'pixi-projection'
import type { Card, CharacterClass } from 'shared'
import { CardEl, CardSprite } from './Card'

const characterClasses: CharacterClass[] = [
    'rogue',
    'knight',
    'wizard',
    'bard',
    'cleric',
]

export function CardsTiltedInLine({
    cards,
    cardWidth = 65,
    parentWidth = 500,
}: {
    cards: Card[]
    cardWidth?: number
    parentWidth?: number
}): PixiContainer {
    const bgPaddingPortion = 0.08
    const tiltFactor = 0.7

    const tiltedWidth = tiltFactor * 1.1 * cardWidth

    let spaceBetween = cardWidth * tiltFactor
    const wouldBeTotalWidth = tiltedWidth + (cards.length - 1) * spaceBetween
    if (wouldBeTotalWidth > parentWidth) {
        spaceBetween = (parentWidth - tiltedWidth) / (cards.length - 1)
    }

    const allCardsWidth = spaceBetween * (cards.length - 1) + tiltedWidth
    const leftMargin =
        (parentWidth - allCardsWidth) / 2 + bgPaddingPortion * parentWidth

    const cardsSorted = cards.sort((cardA, cardB) => {
        //@ts-expect-error
        const energyA = characterClasses.includes(cardA.characterClass)
            ? cardA.energy
            : -99
        //@ts-expect-error
        const energyB = characterClasses.includes(cardB.characterClass)
            ? cardB.energy
            : -99

        return energyB - energyA || (cardA.name < cardB.name ? 1 : -1)
    })

    let fullSizeCard: TweenablePixiContainer | null
    let hoveringCardDetails = false

    const cardEls = cardsSorted.map((cardMeta, index) => {
        const sprite = CardSprite({ card: cardMeta, width: cardWidth })

        sprite.interactive = false
        sprite.scale.x = -tiltFactor

        const clearOldFullSizeCard = () => {
            hoveringCardDetails = false

            fullSizeCard && root.removeChild(fullSizeCard)

            fullSizeCard?.destroy()
            fullSizeCard?.children?.pop()?.destroy()

            fullSizeCard = null
        }

        const c = Container(
            {
                x: (cards.length - 1 - index) * spaceBetween + leftMargin,
                y: parentWidth * bgPaddingPortion,
                events: {
                    pointerover: () => {
                        clearOldFullSizeCard()

                        const cardWidth = 400
                        fullSizeCard = Adjust(
                            CardEl({
                                card: cardMeta,
                                width: cardWidth,
                                showTermExplanations: true,
                                explanationsOnLeft: true,
                                explanationsAdjustX: -420,
                                explanationsAdjustY: 200,
                            }),
                            {
                                name: 'FULL SIZE CARD',
                                x: c.x - cardWidth * 0.38,
                                y: c.y - cardWidth * 0.2,
                            }
                        )

                        fullSizeCard.children.forEach(
                            c => (c.interactive = false)
                        )

                        // fullSizeCard.interactive = true
                        // fullSizeCard.on(
                        //     'pointerover',
                        //     () => (hoveringCardDetails = true)
                        // )
                        // fullSizeCard.on('pointerout', () =>
                        //     clearOldFullSizeCard()
                        // )

                        root.addChild(fullSizeCard)
                    },
                    pointerout: async () => {
                        // await nextTick()

                        // if (hoveringCardDetails) return

                        clearOldFullSizeCard()
                    },
                },
            },
            sprite
        )

        //@ts-expect-error
        c.convertTo2d()

        //@ts-expect-error
        c.convertSubtreeTo2d()

        //@ts-expect-error
        c.proj.setAxisX({ x: -cardWidth * 3, y: (cardWidth * 1.4) / 2 }, 1)

        return c
    })

    // const cardInteractionOverlays = cardsSortedByEnergyCost.map(
    //     (cardMeta, index) => {
    //         // const cardSprite = CardSprite({ card: cardMeta, width: cardWidth })
    //         let fullSizeCard: PixiSprite | null

    //         return Container(
    //             {
    //                 name: 'card interaction overlay?',
    //                 x: cardEls[index].x,
    //                 y: cardEls[index].y,
    //             },
    //             Sprite({
    //                 src: Texture.EMPTY,
    //                 width: 45,
    //                 height: 90,
    //                 events: {
    //                     pointerover() {
    //                         fullSizeCard = Adjust(
    //                             CardSprite({
    //                                 card: cardMeta,
    //                                 width: 300,
    //                             }),
    //                             {
    //                                 name: 'FULL SIZE CARD',
    //                                 x: cardEls[index].x,
    //                                 y: cardEls[index].y,
    //                                 anchor: [1, 0.5],
    //                             }
    //                         )
    //                         // console.log('pointer over', { fullSizeCard })
    //                         root.addChild(fullSizeCard)
    //                     },
    //                     pointerout() {
    //                         // console.log('pointer out')
    //                         fullSizeCard && root.removeChild(fullSizeCard)

    //                         fullSizeCard?.destroy()

    //                         fullSizeCard = null
    //                     },
    //                 },
    //             })
    //         )
    //     }
    // )

    const bgWidth = parentWidth * (1 + bgPaddingPortion * 2)
    const bgHeight = cardWidth * 1.4 + parentWidth * bgPaddingPortion * 2

    const root = Container(
        {},
        RoundedRectangleGradientSprite({
            radius: 14,
            gradientArgs: {
                x0: 0,
                y0: 0,
                x1: 0,
                y1: bgHeight,
                colorStops: [{ color: 0x272753, offset: 0 }],
            },
            spriteArgs: {
                width: bgWidth,
                height: bgHeight,
            },
        }),
        ...cardEls
        // ...cardInteractionOverlays
    )

    return root
}
