import { DungeonEntryBg } from './DungeonEntryBg'
import { LevelInfo } from './LevelInfo'
import { SelectedCharacters } from './SelectedCharacters'
import { StartButton } from './StartButton'
import { getEntryScene } from '@/data'
import { Coin } from '@/elements'
import type { PixiContainer } from '@/elementsUtil'
import { Container } from '@/elementsUtil'
import { onUpdate } from '@/util'

const NUM_CHARACTERS_REQUIRED = 3

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
                    startButton.visible =
                        selected?.length === NUM_CHARACTERS_REQUIRED
                },
                true
            ),
        ],
    })
}
