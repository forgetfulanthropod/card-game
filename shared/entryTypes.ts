import type { OwnedCharacter, SceneHas } from './index'
export interface EntryScene extends SceneHas {
    name: 'entry'
    selectedCharacters: OwnedCharacter[]
    selectedLevel: {
        name: string
        num: number
        pointLimit: number
    }
}
