import type {
    Cards,
    Command,
    Characters,
    DamageMap,
    DungeonName,
    SceneHas,
} from '@'

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
    nextNpcCommands: { command: Command; damages: DamageMap }[]
}
type BattleWinState = 'not started' | 'in battle' | 'won' | 'lost'
