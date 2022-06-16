import type { OwnedCharacterStats, SceneHas } from './index'
export interface EntryScene extends SceneHas {
    id: 'entry'
    selectedCharacters: OwnedCharacterStats[]
    selectedLevel: {
        name: string
        num: number
    }
}
