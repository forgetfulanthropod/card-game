import type { EntryScene } from '@shared/index'

import { rulebook } from '@/rulebook/rulebook'

export const initialEntryState: EntryScene = {
    name: 'entry',
    selectedCharacters: [],
    selectedLevel: rulebook.dungeonLevels[0],

}
