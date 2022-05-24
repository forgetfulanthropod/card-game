import type { BattleCursor } from 'shared'
import type { GameActions } from './types'

import { getNpcMoves, makeBattleState, setCards } from '@/gameState'
import { getRulebook } from '@/rulebook'
import { getBattleSceneIn, getEntrySceneIn } from '@/util'

export const changeScene: GameActions['ChangeScene'] = args => {
    const { game } = args
    logger.info('changing scene to', args.newSceneName)
    if (args.newSceneName === 'battle') {
        const entrySceneData = getEntrySceneIn(args.game).get()
        const { selectedCharacters, selectedLevel } = entrySceneData
        const dungeonName = getRulebook().dungeonLevels[selectedLevel.num].name
        game.set(
            'scene',
            makeBattleState({
                chosen: selectedCharacters,
                dungeonName,
                game: args.game,
            })
        )
        const battleScene_ = game.select('scene') as BattleCursor
        // TODO: put getNpcMoves in makeBattleState. Will require retyping of getNpcMoves's call chain.
        battleScene_.set('nextNpcCommands', getNpcMoves(battleScene_))
        const scene = getBattleSceneIn(args.game)
        setCards(scene)
        // putUpDoors(scene) // MARK
    }
}
