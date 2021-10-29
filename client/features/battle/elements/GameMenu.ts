
import type { PixiContainer } from '@/elementsUtil/mypixi'
import { Container } from '@/elementsUtil/mypixi'

import { GameMenuItem } from './GameMenuItem'

const BASE_HEIGHT = 1080


export function GameMenu(): PixiContainer {

    return Container({
        y: BASE_HEIGHT / 2,
        children: [
            GameMenuItem('characters', 0),
            GameMenuItem('items', 1),
            GameMenuItem('materials', 2),
        ],
    })
}
