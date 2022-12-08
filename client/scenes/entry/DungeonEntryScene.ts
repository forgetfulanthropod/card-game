import { EntrySceneCharacterInfo } from '@sharedElements'
import { DungeonEntryBg } from './DungeonEntryBg'
import { SelectedCharactersEl } from './SelectedCharacters'
import { GoButton } from './GoButton'
import { CharacterOptions } from './CharacterOptions'
import { getEntryScene } from '@/data'
import { loopSong, PixiContainer } from '@/elementsUtil'
import { Container } from '@/elementsUtil'
import { onUpdate } from '@/util'
import { callApi } from '@/callApi'

const NUM_CHARACTERS_REQUIRED = 3

export function DungeonEntryScene(): PixiContainer {
    const selectedCharactersCursor =
        getEntryScene().select('selectedCharacters')

    const startButton = GoButton()

    loopSong('entrySceneMusicHooligansBluff')

    return Container(
        {
            name: DungeonEntryScene.name,
            defaultCursor: true,
            onDestroy: [
                onUpdate(
                    selectedCharactersCursor,
                    selected => {
                        if (selected == null) return

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
        CharacterOptions(),
        EntrySceneCharacterInfo()
        // DeckView()
        // GameMenu(), // PlayerCharacterMenu() | ItemsMenu | CraftingMenu
    )
}
