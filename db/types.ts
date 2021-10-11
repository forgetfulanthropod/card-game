import { BattleState } from './battle/types'
import { EntryState } from './entry/types'

export * from './battle/types'

export type SceneName = 'battle' | 'dungeon entry'
export type SceneData = BattleState | EntryState
