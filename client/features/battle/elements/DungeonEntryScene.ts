import { getEntryScene } from '@/data/rootTree'
import Coin from '@/elements/Coin'
import type { PixiContainer } from '@/elementsUtil'
import { Container } from '@/elementsUtil'
import { onUpdate } from '@/util/onUpdate'

import { DungeonEntryBg } from './DungeonEntryBg'
import { LevelInfo } from './LevelInfo'
import { SelectedCharacters } from './SelectedCharacters'
import { StartButton } from './StartButton'

export function DungeonEntryScene(): PixiContainer {
    const selectedCharactersCursor =
        getEntryScene().select('selectedCharacters')

    const startButton = StartButton()

    return Container({
        children: [
            DungeonEntryBg(),
            SelectedCharacters(),
            startButton,
            LevelInfo(),
            // GameMenu(), // PlayerCharacterMenu() | ItemsMenu | CraftingMenu
            Coin(),
        ],
        onDestroy: [
            onUpdate(
                selectedCharactersCursor,
                selected => {
                    startButton.visible = selected.length === 3
                },
                true
            ),
        ],
    })
}
