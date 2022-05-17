import Coin from '@/elements/Coin'
import type { PixiContainer } from '@/elementsUtil'
import { Container } from '@/elementsUtil'

import { DungeonEntryBg } from './DungeonEntryBg'
import { GameMenu } from './GameMenu'
import { LevelInfo } from './LevelInfo'
import { SelectedCharacters } from './SelectedCharacters'
import { StartButton } from './StartButton'

export function DungeonEntryScene(): PixiContainer {
    return Container({
        children: [
            DungeonEntryBg(),
            SelectedCharacters(),
            StartButton(),
            LevelInfo(),
            GameMenu(), // PlayerCharacterMenu() | ItemsMenu | CraftingMenu
            Coin(),
        ],
    })
}
