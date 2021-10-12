import { initialBattleState as initialBattleState } from '@@/db/battle/state'
import { initialEntryState as initialEntryState } from '@@/db/entry/state'
import { tree } from './rootTree'
import { SceneName } from './types'

const nameToState = {
    'battle': initialBattleState,
    'entry': initialEntryState,
}

export function changeScene(newSceneName: SceneName): void {
    tree.set('scene', nameToState[newSceneName])
}
