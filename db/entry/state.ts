import { rulebook } from '../rulebook'
import { EntryScene } from './types'

export const initialEntryState: EntryScene = {
    name: 'entry',
    selectedCharacters: [],
    selectedLevel: rulebook.dungeonLevels[0],
}
