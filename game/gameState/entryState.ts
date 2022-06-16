import type { EntryScene } from 'shared'

import { getRulebook } from '@/rulebook'

export const initialEntryState: EntryScene = {
    id: 'entry',
    selectedCharacters: [],
    selectedLevel: getRulebook().dungeonLevels[0],
}
