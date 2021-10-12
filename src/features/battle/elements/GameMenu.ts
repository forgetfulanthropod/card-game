import { BASE_HEIGHT } from '@/data/battle/constants'
import { GameMenuItem } from './GameMenuItem'
import { Container, PixiContainer } from './mypixi'


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
