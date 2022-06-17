import type { Card } from 'shared'
import type { PixiContainer } from '@/elementsUtil'
import { Sprite, Container } from '@/elementsUtil'
import 'pixi-projection'
import { CardSpritePromise } from '../battle/cards/Card'
import { Texture } from 'pixi.js'

// import type { PixiContainer } from '@mypixi'
// import { Container, Sprite } from '@mypixi'

// import { kaijuCardWidthToHeightRatio } from '@/constants'

// import type { SelectedKaijuBase } from '../QuestCard'

// import { Container2d, Sprite2d } from 'pixi-projection'

// import type { AssetName } from '@/assets'

export function CardsTiltedInLine({
    cards,
    cardWidth = 65,
    parentWidth = 500,
}: {
    cards: Card[]
    cardWidth?: number
    parentWidth?: number
}): PixiContainer[] {
    let spaceBetween = cardWidth / 2

    const wouldBeTotalWidth = cardWidth + (cards.length - 1) * spaceBetween

    if (wouldBeTotalWidth > parentWidth) {
        spaceBetween = (parentWidth - cardWidth) / (cards.length - 1)
    }

    console.log({ cards })

    return cards.map((cardMeta, index) => {
        const wrappedCardEl = Container({
            x: index * spaceBetween,
            // highlight: it.selected && 'yellow'
            children: [
                Sprite({
                    src: Texture.WHITE,
                    width: cardWidth,
                    height: cardWidth * 1.4,
                    tint: 0,
                    alpha: 0.1,
                }),
            ],
        })

        void CardSpritePromise({ card: cardMeta, width: cardWidth }).then(
            sprite => {
                wrappedCardEl.removeChildren()
                wrappedCardEl.addChild(sprite)
                //@ts-expect-error
                wrappedCardEl.convertTo2d()

                //@ts-expect-error
                wrappedCardEl.convertSubtreeTo2d()

                //@ts-expect-error
                wrappedCardEl.proj.setAxisX({ x: cardWidth * 5, y: 0 }, 1)
            }
        )

        return wrappedCardEl
    })
}
