import type { CharacterId, EntryScene, PlayerCharacterId } from 'shared'

import { getRulebook, loadRulebook, ensureRulebooksMigrated } from '@/rulebook'
import { getCharacterMeta } from './battle'
import { rulebookTypeForScene } from '../entryBootstrap'

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

export function getInitialEntryState(sceneId: string = 'entry'): EntryScene {
    ensureRulebooksMigrated()
    const rbType = rulebookTypeForScene(sceneId)
    const rb = loadRulebook(rbType)
    const { playerCharacterStatsMap: statsMap, dungeonLevels } = rb
    const selectedLevel =
        dungeonLevels.find(v => v.name === 'Hooligans Bluff') ??
        dungeonLevels[0]
    return {
        id: (sceneId === 'worlds' || sceneId === 'pvp' || sceneId === 'daily') ? sceneId as any : 'entry',
        selectedCharacters: [null, null, null],
        fullSelectedCharacterDecks: {},
        allCharacterOptions: allCharacterOptionsIds.map(id => statsMap[id]),
        selectedLevel,
        runId: -1,
    }
}
