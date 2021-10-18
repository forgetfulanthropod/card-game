import type { EntryScene } from '@shared/index'

import { rulebook } from '../rulebook'

export const initialEntryState: EntryScene = {
    name: 'entry',
    selectedCharacters: [],
    selectedLevel: rulebook.dungeonLevels[0],
}
