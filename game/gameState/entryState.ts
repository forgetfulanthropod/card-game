import type { CharacterId, EntryScene, PlayerCharacterId } from 'shared'

import { getRulebook } from '@/rulebook'
import { getCharacterMeta } from './battle'

const allCharacterOptionsIds: PlayerCharacterId[] = [
    'frogKnight',
    'gnomeHooligan',
    'warhog',
    'notoriousBean',
    'penguinKnight',
    'skeletonWarrior',
    'matchaGelatinCube',
    'mushroomFarmer',
    'snacky',
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
