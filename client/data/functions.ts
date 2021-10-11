import { initialState as initialBattleState } from '@@/db/battle/state'
import { initialState as initialEntryState } from '@@/db/entry/state'
import { SceneName } from '@@/db/types'
import { tree } from './rootTree'

const nameToState = {
    'battle': initialBattleState,
    'dungeon entry': initialEntryState,
}

export function changeScene(newSceneName: SceneName): void {
    tree.set('scene', nameToState[newSceneName])
}
