
import { GameMenuItem } from './GameMenuItem'
import type { PixiContainer } from './mypixi'
import { Container } from './mypixi'

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
