import type { EntryScene } from '@shared'

import { getRulebook } from '@/rulebook'


export const initialEntryState: EntryScene = {
    name: 'entry',
    selectedCharacters: [],
    selectedLevel: getRulebook().dungeonLevels[0],

}
