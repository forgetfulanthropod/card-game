import type {
    Cards,
    Command,
    Characters,
    DamageMap,
    DungeonName,
    SceneHas,
    CharacterUid,
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
    nextNpcCommands: NextCommand[]
}

/** May later have e.g. DOT effects */
export interface CommandOutcome {
    damages: DamageMap
}

export interface NextCommand {
    command: Command
    outcome: CommandOutcome
    /** Not sure if we'll need other kinds of targets later or not...  */
    targetUids: CharacterUid[]
}

type BattleWinState = 'not started' | 'in battle' | 'won' | 'lost'
