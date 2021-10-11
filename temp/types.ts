import { EntryState } from './entry/types'
import { BattleState } from './battle/types'

export * from './battle/types'

export type SceneName = 'battle' | 'dungeon entry'
export type SceneData = BattleState | EntryState
