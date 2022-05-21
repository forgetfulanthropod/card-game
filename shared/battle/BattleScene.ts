import type { Cards, EnemyIntent } from './Card'
import type { Characters } from './Characters'
import type { DungeonName, SceneHas, SpecialDoorName } from '@'

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
    doors: { options: SpecialDoorName[]; descriptions: string[] }
    roomsPassed: number
    nextNpcMoves: EnemyIntent[]
}
type BattleWinState = 'not started' | 'in battle' | 'won' | 'lost'
