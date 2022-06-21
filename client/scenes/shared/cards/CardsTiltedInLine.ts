import 'pixi-projection'
import type { Card } from 'shared'
import { CardSprite } from './Card'
import type { PixiContainer } from '@/elementsUtil'
import { RoundedRectangleGradientSprite, Container } from '@/elementsUtil'

export function CardsTiltedInLine({
    cards,
    cardWidth = 65,
    parentWidth = 500,
}: {
    cards: Card[]
    cardWidth?: number
    parentWidth?: number
}): PixiContainer {
    let spaceBetween = cardWidth / 2

    const wouldBeTotalWidth = cardWidth + (cards.length - 1) * spaceBetween

    if (wouldBeTotalWidth > parentWidth) {
        spaceBetween = (parentWidth - cardWidth) / (cards.length - 1)
    }

    const bgPaddingPortion = 0.08

    const cardEls = cards.map((cardMeta, index) => {
        const sprite = CardSprite({ card: cardMeta, width: cardWidth })

        const tiltFactor = 0.7
        sprite.scale.x = -0.8

        const c = Container(
            {
                x:
                    (cards.length - 1 - index) * spaceBetween +
                    (cardWidth / 2) * tiltFactor,
                y: parentWidth * bgPaddingPortion,
            },
            sprite
        )

        c.addChild(sprite)

        //@ts-expect-error
        c.convertTo2d()

        //@ts-expect-error
        c.convertSubtreeTo2d()

        //@ts-expect-error
        c.proj.setAxisX({ x: -cardWidth * 3, y: (cardWidth * 1.4) / 2 }, 1)

        return c
    })

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
                colorStops: [
                    { color: 0x333333, offset: 0 },
                    { color: 0x333333, offset: 0.3 },
                    { color: 0x666666, offset: 1 },
                ],
            },
            spriteArgs: {
                width: bgWidth,
                height: bgHeight,
            },
        }),
        ...cardEls
    )
    root.cacheAsBitmap = true
    return root
}
