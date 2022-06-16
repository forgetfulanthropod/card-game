import type { SceneHas } from '@misc'
import type { OwnedCharacterStats } from './battle'

export interface EntryScene extends SceneHas {
    id: 'entry'
    selectedCharacters: OwnedCharacterStats[]
    selectedLevel: {
        name: string
        num: number
    }
}
