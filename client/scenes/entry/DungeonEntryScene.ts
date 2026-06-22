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

/**
 * DungeonEntryScene is the ABSTRACT/BASE component for ALL Worlds + PVP
 * entry, character/team selection, and setup flow.
 * WorldsScene and PVPScene MUST extend this.
 * Daily is the ONLY exception (no selection UI).
 */
export class DungeonEntryScene extends PixiContainer {
    constructor() {
        super()
        collectData('ui_ux_view', { page_title: 'Character Select' })
        const selectedCharactersCursor =
            getEntryScene().select('selectedCharacters')

        const startButton = GoButton()

        loopSong('entrySceneMusicHooligansBluff')

        // Build default content (subclasses can customize by overriding or post-super add)
        const children = [
            DungeonEntryBg(),
            SelectedCharactersEl(),
            startButton,
            CharacterOptions(),
            RollKaijuContainer(),
            EntrySceneCharacterInfo(),
            // DeckView()
            // GameMenu(), // PlayerCharacterMenu() | ItemsMenu | CraftingMenu
        ].filter(Boolean)

        children.forEach((ch) => ch && this.addChild(ch))

        this.name = 'DungeonEntryScene'

        const unbind = onUpdate(
            selectedCharactersCursor,
            (selected) => {
                if (selected == null) return
                startButton.visible =
                    selected.filter((s) => s).length ===
                    NUM_CHARACTERS_REQUIRED
            },
            true
        )
        this.on('destroyed', () => {
            try { unbind && unbind() } catch {}
        })
    }
}

// Back-compat factory for existing call sites during transition (new preferred)
export function createDungeonEntryScene(): PixiContainer {
    return new DungeonEntryScene()
}

// Default export for scenes/index that re-exports the base
export { DungeonEntryScene as DungeonEntrySceneFnForLegacy } // not used; prefer class or create

