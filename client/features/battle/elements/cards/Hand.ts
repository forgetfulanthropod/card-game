import type { Pile } from 'shared'

import { keys, vals } from 'shared/code'
import { Card } from './Card'
import type { PixiContainer } from '@/elementsUtil'
import { BASE_HEIGHT, BASE_WIDTH, Container } from '@/elementsUtil'

export function Hand(pile: Pile): PixiContainer {
    const cardUids = keys(pile)

    const children = vals(pile).map((card, index) => {
        return Card({ index, pile, card, name: cardUids[index] })
    })

    return Container({
        x: BASE_WIDTH * 0.5,
        y: BASE_HEIGHT * 1,
        children,
    })
}
