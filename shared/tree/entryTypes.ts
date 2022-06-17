import type { SceneHas } from '@misc'
import type { CharacterUid, OwnedCharacterStats, Pile } from './battle'

export interface EntryScene extends SceneHas {
    id: 'entry'
    selectedCharacters: OwnedCharacterStats[]
    fullSelectedCharacterDecks: Record<CharacterUid, Pile>
    selectedLevel: {
        name: string
        num: number
    }
}
