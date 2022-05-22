import type { Card, Cards } from './Card'
import type { Characters } from './Characters'
import type { DungeonName, SceneHas } from '@'

export interface BattleScene extends SceneHas {
    username: string
    name: 'battle'
    dungeonName: DungeonName
    state: BattleWinState
    playerStarts: boolean
    isPlayerTurn: boolean
    allCharacters: Characters
    cards: Cards
    energy: number
    isBasicLoaded: boolean
    isDeluxeLoaded: boolean
    turnCount: number
    roomsPassed: number
    nextEnemyCards: Card[]
}
type BattleWinState = 'not started' | 'in battle' | 'won' | 'lost'
