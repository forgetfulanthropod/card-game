import type { SceneName } from '@shared'

import { makeBattleState } from '@/gameState/battle'
import { rulebook } from '@/rulebook/index'
import { getEntryScene, getGameStateCursor, onCallWrapper } from '@/util'


export default onCallWrapper(function changeScene(args: { newSceneName: SceneName }): void {
    logger.info('changing scene to', args.newSceneName)
    const tree = getGameStateCursor('alice')
    if (args.newSceneName === 'battle') {
        const entrySceneData = (getEntryScene('alice')).get()
        const { selectedCharacters, selectedLevel } = entrySceneData
        const dungeonName = rulebook.dungeonLevels[selectedLevel.num - 1].name
        tree.setK('scene', makeBattleState({ chosen: selectedCharacters, dungeonName }))
    }
    tree.commit()

})
