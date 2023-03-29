import { EntrySceneCharacterInfo } from '@sharedElements'
import { DungeonEntryBg } from './DungeonEntryBg'
import { SelectedCharactersEl } from './SelectedCharacters'
import { GoButton } from './GoButton'
import { CharacterOptions } from './CharacterOptions'
import { RollKaijuContainer } from './RollKaijuContainer'
import { getEntryScene } from '@/data'
import { loopSong, PixiContainer } from '@/elementsUtil'
import { Container } from '@/elementsUtil'
import { onUpdate } from '@/util'
import { callApi } from '@/callApi'
import { collectData } from '@/analytics/collectData'

const NUM_CHARACTERS_REQUIRED = 3

export function DungeonEntryScene(): PixiContainer {
    collectData('ui_ux_view', { page_title: 'Character Select' })
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
        RollKaijuContainer(),
        EntrySceneCharacterInfo()
        // DeckView()
        // GameMenu(), // PlayerCharacterMenu() | ItemsMenu | CraftingMenu
    )
}
