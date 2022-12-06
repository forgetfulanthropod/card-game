import type { CharacterId, EntryScene } from 'shared'

import { getRulebook } from '@/rulebook'
import { getCharacterMeta } from './battle'

const allCharacterOptionsIds: CharacterId[] = [
    'frogKnight',
    'mushroomFarmer',
    'penguinKnight',
    'skeletonWarrior',
    'matchaGelatinCube',
    'warhog',
    'gnomeHooligan',
    'jerry',
]

export function getInitialEntryState(): EntryScene {
    const { characters: statsMap } = getRulebook()

    return {
        id: 'entry',
        selectedCharacters: [null, null, null],
        fullSelectedCharacterDecks: {},
        allCharacterOptions: allCharacterOptionsIds.map(id => statsMap[id]),
        selectedLevel: getRulebook().dungeonLevels[0],
    }
}
