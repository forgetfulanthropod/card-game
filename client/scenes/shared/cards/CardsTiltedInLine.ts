import 'pixi-projection'
import type { Card } from 'shared'
import { CardSprite } from './Card'
import type { PixiContainer } from '@/elementsUtil'
import { Container } from '@/elementsUtil'

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
}): PixiContainer {
    let spaceBetween = cardWidth / 2

    const wouldBeTotalWidth = cardWidth + (cards.length - 1) * spaceBetween

    if (wouldBeTotalWidth > parentWidth) {
        spaceBetween = (parentWidth - cardWidth) / (cards.length - 1)
    }

    const cardEls = cards.map((cardMeta, index) => {
        const sprite = CardSprite({ card: cardMeta, width: cardWidth })

        const c = Container({ x: index * spaceBetween, children: [sprite] })
        c.addChild(sprite)
        //@ts-expect-error
        c.convertTo2d()

        //@ts-expect-error
        c.convertSubtreeTo2d()

        //@ts-expect-error
        c.proj.setAxisX(
            {
                x: cardWidth * 5,
                y: (cardWidth * 1.4) / 2,
            },
            1
        )
        return c
    })
    const root = Container({ children: cardEls })
    root.cacheAsBitmap = true
    return root
}
