import { SceneHas } from '@/data/types'
import { OwnedCharacter } from '@@/db/datamodel'
export interface EntryState extends SceneHas {
    name: 'entry',
    selectedCharacters: OwnedCharacter[],
    selectedLevel: number,
}
