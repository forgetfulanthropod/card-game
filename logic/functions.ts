import { tree } from '@@/client/data/rootTree'
import { SceneName } from '@@/client/data/types'
import { rulebook } from '@@/db/data'

export function changeScene(newSceneName: SceneName): void {
    tree.set('scene', rulebook.initialScenes[newSceneName])
}
