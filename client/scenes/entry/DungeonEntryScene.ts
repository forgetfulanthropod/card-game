import { RootCharacterInfo } from '@sharedElements'
import { DungeonEntryBg } from './DungeonEntryBg'
import { SelectedCharacters } from './SelectedCharacters'
import { GoButton } from './GoButton'
import { getEntryScene } from '@/data'
import type { PixiContainer } from '@/elementsUtil'
import { Container } from '@/elementsUtil'
import { hoveredCharacterUid, onUpdate } from '@/util'

const NUM_CHARACTERS_REQUIRED = 3

export function DungeonEntryScene(): PixiContainer {
    const selectedCharactersCursor =
        getEntryScene().select('selectedCharacters')

    const startButton = GoButton()

    return Container(
        {
            name: DungeonEntryScene.name,
            events: {
                pointerdown() {
                    hoveredCharacterUid.set(null)
                },
            },
            defaultCursor: true,
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
        },
        DungeonEntryBg(),
        SelectedCharacters(),
        startButton,
        // LevelInfo(),
        RootCharacterInfo()
        // GameMenu(), // PlayerCharacterMenu() | ItemsMenu | CraftingMenu
    )
}
