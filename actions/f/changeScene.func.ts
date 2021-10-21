import type { SceneName } from '@shared/index'

import { makeBattleState } from '../gameState/battle/state'
import { rulebook } from '../rulebook/index'
import { getEntryScene, getGameStateCursor } from '../util/getters'
import { onCallWrapper } from '../util/onCallWrapper'

export default onCallWrapper(async function changeScene(args: { newSceneName: SceneName }): Promise<void> {
    console.log('changing scene to', args.newSceneName)
    const tree = await getGameStateCursor('alice')
    if (args.newSceneName === 'battle') {
        const entrySceneData = (await getEntryScene('alice')).get()
        const { selectedCharacters, selectedLevel } = entrySceneData
        const dungeonName = rulebook.dungeonLevels[selectedLevel.num - 1].name
        tree.setK('scene', makeBattleState({ chosen: selectedCharacters, dungeonName }))
    }
    await tree.flush()

})
