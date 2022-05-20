import type { DungeonName, SceneHas, SpecialDoorName } from '../index'
import type { Cards } from './Card'
import type { Characters } from './Characters'
import type { AttackData } from './Moves'

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
    nextNpcMoves: AttackData[]
}
type BattleWinState = 'not started' | 'in battle' | 'won' | 'lost'
