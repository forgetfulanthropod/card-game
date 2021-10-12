import { initialBattleState } from '@@/db/battle/state'
import { initialEntryState } from '@@/db/entry/state'
import { tree } from '@@/client/data/rootTree'
import { Scene, SceneName } from '@@/client/data/types'

const nameToState: Record<SceneName, Scene> = {
    'battle': initialBattleState,
    'entry': initialEntryState,
    'map': { name: 'map', coordinates: [-1, -1], unlockedLocations: [] },
    'craft': { name: 'craft', onTable: {}, selectedRecipe: '' },
}

export function changeScene(newSceneName: SceneName): void {
    tree.set('scene', nameToState[newSceneName])
}
