import { RootCharacterInfo } from '../shared/CharacterInfo'
import { DungeonEntryBg } from './DungeonEntryBg'
import { LevelInfo } from './LevelInfo'
import { SelectedCharacters } from './SelectedCharacters'
import { StartButton } from './StartButton'
import { getEntryScene } from '@/data'
import type { PixiContainer } from '@/elementsUtil'
import { Container } from '@/elementsUtil'
import { onUpdate } from '@/util'

const NUM_CHARACTERS_REQUIRED = 3

export function DungeonEntryScene(): PixiContainer {
    const selectedCharactersCursor =
        getEntryScene().select('selectedCharacters')

    const startButton = StartButton()

    return Container({
        name: DungeonEntryScene.name,
        children: [
            DungeonEntryBg(),
            SelectedCharacters(),
            startButton,
            LevelInfo(),
            RootCharacterInfo(),
            // GameMenu(), // PlayerCharacterMenu() | ItemsMenu | CraftingMenu
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
