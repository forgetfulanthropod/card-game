import { getBattleScene } from '@/data'
import {
    Adjust,
    BASE_WIDTH,
    Container,
    getStage,
    If,
    noDestroy,
    PixiContainer,
    portalize,
    RoundedRectangleGradientSprite,
    TweenablePixiContainer,
} from '@/elementsUtil'
import { toDatum } from '@/util'
import { compose } from 'datums'
import { OutlineFilter } from 'pixi-filters'
import type { Card, CharacterClass, CharacterMeta } from 'shared'
import { vals } from 'shared/code'
import { CardEl, CardSprite } from './Card'

const characterClasses: CharacterClass[] = [
    'rogue',
    'knight',
    'wizard',
    'bard',
    'cleric',
]

export function CardsTiltedInLineForCharacter(
    cm: CharacterMeta,
    deckOrPool: 'deck' | 'pool',
    onClick?: (card: Card) => void
) {
    const scene = getBattleScene()

    const cardsDatum =
        deckOrPool === 'deck'
            ? toDatum(scene.select('cards', 'draw'), pile =>
                  vals(pile).filter(c => c.characterUid === cm.uid)
              )
            : toDatum(
                  scene.select('fullSelectedCharacterDecks', cm.uid),
                  pile => vals(pile)
              )

    const outlineFilter = new OutlineFilter(3, 0)

    const root = If(cardsDatum, cards => CardsTiltedInLine({ cards, onClick }))

    root.filters = [outlineFilter]

    root.on('destroyed', () => outlineFilter.destroy())

    return root
}

export const DEFAULT_TILTED_CARDS_WIDTH = 500

export function CardsTiltedInLine({
    cards,
    cardWidth = 65,
    parentWidth = DEFAULT_TILTED_CARDS_WIDTH,
    onClick,
}: {
    cards: Card[]
    cardWidth?: number
    parentWidth?: number
    onClick?: (card: Card) => void
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

    const cardEls = cardsSorted.map((cardMeta, index) => {
        const sprite = CardSprite({ card: cardMeta, width: cardWidth })

        sprite.interactive = false
        sprite.scale.x = -tiltFactor

        const clearOldFullSizeCard = () => {
            fullSizeCard && getStage().removeChild(fullSizeCard)

            fullSizeCard?.destroy()
            fullSizeCard?.children?.pop()?.destroy()

            fullSizeCard = null
        }

        const c = Container(
            {
                x: (cards.length - 1 - index) * spaceBetween + leftMargin,
                y: parentWidth * bgPaddingPortion,
                events: {
                    pointerenter: () => {
                        clearOldFullSizeCard()

                        const cardWidth = 400
                        fullSizeCard = Adjust(
                            CardEl({
                                card: cardMeta,
                                width: cardWidth,
                                showTermExplanations: true,
                                explanationsOnLeft:
                                    root.getGlobalPosition().x > BASE_WIDTH / 2,
                                explanationsAdjustY: 200,
                            }),
                            {
                                name: 'FULL SIZE CARD',
                                x:
                                    Math.max(
                                        root.getGlobalPosition().x + c.x,
                                        cardWidth
                                    ) -
                                    cardWidth * 0.38,
                                y:
                                    root.getGlobalPosition().y +
                                    c.y -
                                    cardWidth * 0.2,
                            }
                        )

                        fullSizeCard.children.forEach(
                            c => (c.interactive = false)
                        )

                        portalize({
                            from: root,
                            content: fullSizeCard,
                        })
                    },
                    pointerleave: async () => {
                        clearOldFullSizeCard()
                    },
                    pointerup() {
                        onClick && onClick(cardMeta)
                    },
                },
            },
            sprite
        )
        const x = -cardWidth * 3
        const y = (cardWidth * 1.4) / 2
        const d = Math.sqrt(x * x + y * y)

        c.scale.x = x / d
        c.skew.set(1 / d, y / d)

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
