import { BattleState } from './battle/factories'
import { EntryState } from './entry/types'

export type SceneName = 'battle' | 'dungeon entry'
export type SceneData = BattleState | EntryState
