import { initialState as initialBattleState } from '@/../temp/battle/state'
import { initialState as initialEntryState } from '@/../temp/entry/state'
import { tree } from './rootTree'
import { SceneName } from '../../temp/types'

const nameToState = {
    'battle': initialBattleState,
    'dungeon entry': initialEntryState,
}

export function changeScene(newSceneName: SceneName): void {
    tree.set('scene', nameToState[newSceneName])
}
