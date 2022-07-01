import { RootCharacterInfo } from '@sharedElements'
import { compose } from 'datums'
import { DungeonEntryBg } from './DungeonEntryBg'
import { SelectedCharactersEl } from './SelectedCharacters'
import { GoButton } from './GoButton'
import {
    CharacterOptions,
    selectedCharacterPlaceIndex,
} from './CharacterOptions'
import { getEntryScene } from '@/data'
import type { PixiContainer } from '@/elementsUtil'
import { If, Container } from '@/elementsUtil'
import { onUpdate } from '@/util'

const NUM_CHARACTERS_REQUIRED = 3

export function DungeonEntryScene(): PixiContainer {
    const selectedCharactersCursor =
        getEntryScene().select('selectedCharacters')

    const startButton = GoButton()

    return Container(
        {
            name: DungeonEntryScene.name,
            defaultCursor: true,
            onDestroy: [
                onUpdate(
                    selectedCharactersCursor,
                    selected => {
                        startButton.visible =
                            selected.filter(s => s).length ===
                            NUM_CHARACTERS_REQUIRED
                    },
                    true
                ),
            ],
        },
        DungeonEntryBg(),
        SelectedCharactersEl(),
        startButton,
        If(
            compose(([i]) => i != null, selectedCharacterPlaceIndex),
            () => CharacterOptions()
        ),
        RootCharacterInfo()
        // GameMenu(), // PlayerCharacterMenu() | ItemsMenu | CraftingMenu
    )
}
