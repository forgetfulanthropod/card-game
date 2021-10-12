import { initialState as initialBattleState } from '@@/db/battle/state'
import { initialState as initialEntryState } from '@@/db/entry/state'
import { tree } from './rootTree'
import { SceneName } from './types'

const nameToState = {
    'battle': initialBattleState,
    'entry': initialEntryState,
}

export function changeScene(newSceneName: SceneName): void {
    tree.set('scene', nameToState[newSceneName])
}
