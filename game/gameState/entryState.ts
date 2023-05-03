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
    const { playerCharacterStatsMap: statsMap, dungeonLevels } = getRulebook()
    const selectedLevel =
        dungeonLevels.find(v => v.name === 'Hooligans Bluff') ??
        dungeonLevels[0]
    return {
        id: 'entry',
        selectedCharacters: [null, null, null],
        fullSelectedCharacterDecks: {},
        allCharacterOptions: allCharacterOptionsIds.map(id => statsMap[id]),
        selectedLevel,
        runId: -1,
    }
}
