import { Texture } from 'pixi.js'
import type { Card } from 'shared'
import type { PixiContainer } from '@/elementsUtil'
import { Sprite, Container } from '@/elementsUtil'
import 'pixi-projection'
import { CardSpritePromise } from '../battle/cards/Card'

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
    let spaceBetween = cardWidth * 0.8

    const wouldBeTotalWidth = cardWidth + (cards.length - 1) * spaceBetween

    if (wouldBeTotalWidth > parentWidth) {
        spaceBetween = (parentWidth - cardWidth) / (cards.length - 1)
    }

    return cards.map((cardMeta, index) => {
        const wrappedCardEl = Container(
            { x: (cards.length - index) * spaceBetween - cardWidth * 0.5 },
            // highlight: it.selected && 'yellow'
            Sprite({
                src: Texture.WHITE,
                width: cardWidth,
                height: cardWidth * 1.4,
                tint: 0,
                alpha: 0.1,
            })
        )

        void CardSpritePromise({ card: cardMeta, width: cardWidth }).then(
            sprite => {
                sprite.scale.x = -1
                wrappedCardEl.removeChildren()
                wrappedCardEl.addChild(sprite)
                //@ts-expect-error
                wrappedCardEl.convertTo2d()

                //@ts-expect-error
                wrappedCardEl.convertSubtreeTo2d()

                //@ts-expect-error
                wrappedCardEl.proj.setAxisX(
                    { x: -cardWidth * 6, y: (cardWidth * 1.4) / 2 },
                    1
                )
            }
        )

        return wrappedCardEl
    })
}
