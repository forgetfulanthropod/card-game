import type { SceneHas } from '@misc'
import type {
    CharacterUid,
    OwnedCharacterStats,
    Pile,
    PlayerCharacterStats,
} from './battle'
import { SwordParts } from './Sword'

export type SelectedCharacter =
    | (OwnedCharacterStats & { sword?: SwordParts })
    | null
export type SelectedCharacters = [
    SelectedCharacter,
    SelectedCharacter,
    SelectedCharacter
]

export interface EntryScene extends SceneHas {
    id: 'entry'
    selectedCharacters: SelectedCharacters
    fullSelectedCharacterDecks: Record<CharacterUid, Pile>
    allCharacterOptions: PlayerCharacterStats[]
    selectedLevel: {
        name: string
        num: number
    }
    runId: number
    /** Roll mode chosen from main menu (daily vs completionist). */
    rollPlain?: boolean
    rollEnhanced?: boolean
}
