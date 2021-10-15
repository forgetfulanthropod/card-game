import { getEntryScene, tree } from '@@/client/data/rootTree'
import { SceneName } from '@@/client/data/types'
import { makeBattleState } from '@@/db/battle/state'

export function changeScene(newSceneName: SceneName): void {
    if (newSceneName === 'battle') {
        tree.set('scene', makeBattleState(getEntryScene().select('selectedCharacters').get()))
    }
    // tree.set('scene', rulebook.initialScenes[newSceneName])
}
