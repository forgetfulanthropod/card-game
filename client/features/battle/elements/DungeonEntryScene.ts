import DungeonEntryPng from '../assets/temple_background.png'
import background from './background'
import { GameMenu } from './GameMenu'
import { LevelInfo } from './LevelInfo'
import { Container, PixiContainer } from './mypixi'
import { SelectedCharacters } from './SelectedCharacters'
import { StartButton } from './StartButton'


export function DungeonEntryScene(): PixiContainer {
    return Container({
        children: [
            background({ scale: 1, srcs: [DungeonEntryPng] }),
            SelectedCharacters(),
            StartButton(),
            LevelInfo(),
            GameMenu(), // PlayerCharacterMenu() | ItemsMenu | CraftingMenu
        ]
    })
}
