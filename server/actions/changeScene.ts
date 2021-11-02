
import type { ChangeScene } from '@shared'

import { makeBattleState } from '@/gameState/battle'
import { getRulebook } from '@/rulebook'
import { commit, getEntryScene, getGameStateCursor } from '@/util'

export const changeScene: ChangeScene = (args) => {
    logger.info('changing scene to', args.newSceneName)
    const tree = getGameStateCursor('alice')
    if (args.newSceneName === 'battle') {
        const entrySceneData = (getEntryScene('alice')).get()
        const { selectedCharacters, selectedLevel } = entrySceneData
        const dungeonName = getRulebook().dungeonLevels[selectedLevel.num - 1].name
        tree.set('scene', makeBattleState({ chosen: selectedCharacters, dungeonName }))
    }
    commit(tree)

}
