import type { GameActions, OwnedCharacterStats } from 'shared'

import { clearAllEffects, makeBattleState, setCards } from '@/gameState'
import { getRulebook } from '@/rulebook'
import { getBattleSceneIn, getEntrySceneIn } from '@/util'
import { acquireTalents } from './chooseEventResponse'

export const changeScene: GameActions['changeScene'] = args => {
    const { game } = args
    //TODO: VALIDATE
    // logger.info('changing scene to ' + args.newSceneName)
    if (args.newSceneName === 'battle') {
        const entrySceneData = getEntrySceneIn(args.game).get()
        const { selectedCharacters, selectedLevel, runId } = entrySceneData
        const dungeonName = getRulebook().dungeonLevels[selectedLevel.num].name
        game.set(
            'scene',
            makeBattleState({
                chosen: selectedCharacters
                    .filter(c => c != null)
                    .map(c => c as OwnedCharacterStats),
                dungeonName,
                game: args.game,
                runId,
            })
        )
        const scene = getBattleSceneIn(args.game)
        setCards(scene)
        acquireTalents(scene)
    } else if (args.newSceneName === 'showcase') {
        game.set('scene', { id: 'showcase' })
    } else if (['worlds', 'pvp', 'daily', 'shop', 'creator', 'entry'].includes(args.newSceneName)) {
        // Entry variants + menu stubs - keep or set entry data shape for selection scenes
        const cur = game.select('scene').get()
        game.set('scene', { ...cur, id: args.newSceneName as any })
    }
}
