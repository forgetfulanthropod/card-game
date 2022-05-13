import type { ChangeScene } from '@serverActions'

import {
    getNpcMoves,
    makeBattleState,
    putUpDoors,
    setCards,
} from '@/gameState/battle'
import { getRulebook } from '@/rulebook'
import type { BattleCursor } from '@/util'
import { getBattleScene, getEntryScene, getGameStateCursor } from '@/util'

export const changeScene: ChangeScene = args => {
    logger.info('changing scene to', args.newSceneName)
    const tree = getGameStateCursor(args.username)
    if (args.newSceneName === 'battle') {
        const entrySceneData = getEntryScene(args.username).get()
        const { selectedCharacters, selectedLevel } = entrySceneData
        const dungeonName =
            getRulebook().dungeonLevels[selectedLevel.num - 1].name
        tree.set(
            'scene',
            makeBattleState({
                chosen: selectedCharacters,
                dungeonName,
                username: args.username,
            })
        )
        const battleScene_ = tree.select('scene') as BattleCursor
        // TODO: put getNpcMoves in makeBattleState. Will require retyping of getNpcMoves's call chain.
        battleScene_.set('nextNpcMoves', getNpcMoves(battleScene_))
        const scene = getBattleScene(args.username)
        setCards(scene)
        putUpDoors(scene)
    }
}
