import 'pixi-projection'
import type { Card } from 'shared'
import { Texture } from 'pixi.js'
import { CardSprite } from './Card'
import type { PixiContainer } from '@/elementsUtil'
import { Container, Sprite } from '@/elementsUtil'
import { nextTick } from '@/util'

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

        const sprite = CardSprite({ card: cardMeta, width: cardWidth })
        void nextTick().then(
            () =>
                void nextTick().then(
                    () =>
                        void nextTick().then(
                            () =>
                                void nextTick().then(() => {
                                    wrappedCardEl.removeChildren()
                                    wrappedCardEl.addChild(sprite)
                                    //@ts-expect-error
                                    wrappedCardEl.convertTo2d()

                                    //@ts-expect-error
                                    wrappedCardEl.convertSubtreeTo2d()

                                    //@ts-expect-error
                                    wrappedCardEl.proj.setAxisX(
                                        {
                                            x: cardWidth * 5,
                                            y: (cardWidth * 1.4) / 2,
                                        },
                                        1
                                    )
                                })
                        )
                )
        )
        return wrappedCardEl
    })
}
