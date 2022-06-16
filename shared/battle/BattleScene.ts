import type {
    Card,
    Characters,
    CharacterUid,
    Command,
    CommandQueue,
    StatChangeMap,
    DungeonName,
    Pile,
    Piles,
    SceneHas,
    RequiredAction,
} from '@'

export interface BattleScene extends SceneHas {
    username: string
    id: 'battle'
    dungeonName: DungeonName
    state: BattleWinState
    playerStarts: boolean
    isPlayerTurn: boolean
    allCharacters: Characters
    cards: Piles
    newCardOptions: Pile
    energy: number
    isBasicLoaded: boolean
    isDeluxeLoaded: boolean
    turnCount: number
    numRoomsPassed: number
    nextNpcCommands: NextCommand[]
    cardsPlayedThisRoom: (Card & { timestamp: string })[]
    requireAction: RequiredAction | null
    queue: CommandQueue
}

/** May later have e.g. DOT effects */
export interface CommandOutcome {
    damages: StatChangeMap
    blocks: StatChangeMap
}

export interface NextCommand {
    command: Command
    outcome: CommandOutcome
    /** Not sure if we'll need other kinds of targets later or not...  */
    targetUids: CharacterUid[]
}

type BattleWinState = 'in battle' | 'won' | 'lost' | 'choosing cards'
