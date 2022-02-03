import type { OwnedCharacterStats, SceneHas } from './index'
export interface EntryScene extends SceneHas {
    name: 'entry'
    selectedCharacters: OwnedCharacterStats[]
    selectedLevel: {
        name: string
        num: number
        pointLimit: number
    }
}
