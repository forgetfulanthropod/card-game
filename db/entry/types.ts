import { SceneHas } from '@/data/types'
import { OwnedCharacter } from '@@/db/datamodel'
export interface EntryScene extends SceneHas {
    name: 'entry',
    selectedCharacters: OwnedCharacter[],
    selectedLevel: {
        name: string
        num: number
        pointLimit: number
    },
}
