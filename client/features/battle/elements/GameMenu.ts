
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
            // Sprite({
            //     src:
            // })
            // background({ scale: 1, srcs: [DungeonEntryPng] }),
            // GameMenu() // PlayerCharacterMenu() | ConsumableItemsMenu | EquippableItemsMenu
            // LevelInfo()
            // PlayerCharacters()
        ]
    })
}
