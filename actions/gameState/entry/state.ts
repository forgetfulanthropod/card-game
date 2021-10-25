import type { EntryScene } from '@shared'

import { rulebook } from '@/rulebook/rulebook'


export const initialEntryState: EntryScene = {
    name: 'entry',
    selectedCharacters: [],
    selectedLevel: rulebook.dungeonLevels[0],

}
