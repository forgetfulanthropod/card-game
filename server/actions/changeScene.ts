
import type { ChangeScene } from '@serverActions'

import { makeBattleState, putUpDoors } from '@/gameState/battle'
import { getRulebook } from '@/rulebook'
import { getBattleScene, getEntryScene, getGameStateCursor } from '@/util'


export const changeScene: ChangeScene = (args) => {
        logger.info('changing scene to', args.newSceneName)
        const tree = getGameStateCursor(args.username)
        if (args.newSceneName === 'battle') {
                const entrySceneData = (getEntryScene(args.username)).get()
                const { selectedCharacters, selectedLevel } = entrySceneData
                const dungeonName = getRulebook().dungeonLevels[selectedLevel.num - 1].name
                tree.set('scene', makeBattleState({ chosen: selectedCharacters, dungeonName, username: args.username }))
                putUpDoors(getBattleScene(args.username))
        }

}
