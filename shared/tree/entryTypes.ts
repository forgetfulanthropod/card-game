import type { SceneHas } from '@misc'
import type {
    CharacterStats,
    CharacterUid,
    OwnedCharacterStats,
    Pile,
    PlayerCharacterStats,
} from './battle'

export type SelectedCharacter = OwnedCharacterStats | null
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
}
