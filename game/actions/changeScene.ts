import type { GameActions, OwnedCharacterStats } from 'shared'

import { clearAllEffects, makeBattleState, setCards } from '@/gameState'
import { getRulebook } from '@/rulebook'
import { getBattleSceneIn, getEntrySceneIn } from '@/util'

export const changeScene: GameActions['changeScene'] = args => {
    const { game } = args
    //TODO: VALIDATE
    // logger.info('changing scene to ' + args.newSceneName)
    if (args.newSceneName === 'battle') {
        const entrySceneData = getEntrySceneIn(args.game).get()
        const { selectedCharacters, selectedLevel } = entrySceneData
        const dungeonName = getRulebook().dungeonLevels[selectedLevel.num].name
        game.set(
            'scene',
            makeBattleState({
                chosen: selectedCharacters
                    .filter(c => c != null)
                    .map(c => c as OwnedCharacterStats),
                dungeonName,
                game: args.game,
            })
        )
        const scene = getBattleSceneIn(args.game)
        setCards(scene)
    }
}
