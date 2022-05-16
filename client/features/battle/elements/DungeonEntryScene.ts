import Coin from '@/elements/Coin'
import type { PixiContainer } from '@/elementsUtil'
import { Container } from '@/elementsUtil'

import DungeonEntryBg from '../assets/backgrounds/temple_loop_fractal.mp4'
import background from './background'
import { GameMenu } from './GameMenu'
import { LevelInfo } from './LevelInfo'
import { SelectedCharacters } from './SelectedCharacters'
import { StartButton } from './StartButton'

export function DungeonEntryScene(): PixiContainer {
    return Container({
        children: [
            background({ scale: 1, src: DungeonEntryBg }),
            SelectedCharacters(),
            StartButton(),
            LevelInfo(),
            GameMenu(), // PlayerCharacterMenu() | ItemsMenu | CraftingMenu
            Coin(),
        ],
    })
}
