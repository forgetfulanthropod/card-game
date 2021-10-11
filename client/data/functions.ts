import { initialState as initialBattleState } from '@@/db/battle/state'
import { initialState as initialEntryState } from '@@/db/entry/state'
import { tree } from './rootTree'
import { SceneName } from '@@/db/types'

const nameToState = {
    'battle': initialBattleState,
    'dungeon entry': initialEntryState,
}

export function changeScene(newSceneName: SceneName): void {
    tree.set('scene', nameToState[newSceneName])
}
