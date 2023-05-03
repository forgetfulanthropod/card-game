import type { RequiredAction } from '@actions'
import type { SceneHas } from '@misc'
import type { DungeonRoom, DungeonRoomMap, RoomUid } from '../Dungeon'

import type {
    ClaimableLoot,
    ClaimedLoot,
    RunScore,
    RunScoreAttributeName,
    TreasureChest,
} from '.'
import { EventScene } from '../EventScene'
import { Souvenir } from '../Souvenir'
import { RunID, UserID } from '../User'
import type {
    Card,
    Command,
    CommandHookId,
    CommandHooks,
    Pile,
    Piles,
} from './Card'
import type { StatChangeMap } from './CardHit'
import type { CharacterUid } from './Character'
import type { Characters, StanceId } from './Characters'
import type { CommandQueue, QueuedCommand } from './CommandQueue'

export interface BattleScene extends SceneHas {
    userId: UserID
    id: 'battle'
    dungeonName: DungeonName
    state: BattleWinState
    playerStarts: boolean
    isPlayerTurn: boolean
    allCharacters: Characters
    cards: Piles
    newCardOptions: Pile
    fullSelectedCharacterDecks: Record<CharacterUid, Pile>
    handSize: number
    baseHandSize: number
    energy: number
    roundEnergy: number
    isSimulation: boolean
    isBasicLoaded: boolean
    isDeluxeLoaded: boolean
    turnCount: number
    rooms: DungeonRoomMap
    roomUidsVisited: RoomUid[]
    numRoomsPassed: number
    currentRoom: DungeonRoom
    currentEvent?: EventScene
    nextNpcCommands: NextCommand[]
    cardsPlayedThisRoom: (Card & { turnCount: number; timestamp: string })[]
    cardsPlayedThisTurn: (Pick<Card, 'characterUid' | 'uid'> & {
        turnCount: number
        timestamp: string
    })[]
    blocksAppliedThisTurn: { amount: number; targetUid: CharacterUid }[]
    stanceChangesThisRoom: { newStance: StanceId; targetUid: CharacterUid }[]
    damagesDealtThisTurn: { amount: number; targetUid: CharacterUid }[]
    damagesDealtThisRoom: { amount: number; targetUid: CharacterUid }[]
    damagesUnblockedThisTurn: { amount: number; targetUid: CharacterUid }[]
    damagesUnblockedThisRoom: { amount: number; targetUid: CharacterUid }[]
    scoreEventsThisTurn: Record<RunScoreAttributeName, number>
    scoreEventsThisRoom: Record<RunScoreAttributeName, number>
    cardsDrafted: Card[]
    requireAction: RequiredAction | null
    queue: CommandQueue
    on: CommandHooks
    isInMap: boolean
    lootEarned: ClaimableLoot
    lootClaimed: ClaimedLoot
    lootScreenHasOpened: boolean
    numAllowedToKeep: number
    numRequiredToDiscard: number
    endScreenHasOpened: boolean
    treasureChest: TreasureChest
    runScore: RunScore
    runDuration: {
        startTime: number
        endTime: number | null
    }
    runId: RunID | null
    souvenirs: Souvenir[]
}

/** May later have e.g. DOT effects */
export interface CommandOutcome {
    damages: StatChangeMap
    blocks: StatChangeMap
    effects: StatChangeMap
}

export interface NextCommand {
    command: Command
    outcome: CommandOutcome
    /** Not sure if we'll need other kinds of targets later or not...  */
    targetUids: CharacterUid[]
}

export type BattleWinState =
    | 'in battle'
    | 'won'
    | 'lost'
    | 'collecting loot'
    | 'choosing cards'
    | 'map'

export type DungeonName =
    | 'Skelepit Dungeon'
    | 'Hooligans Bluff'
    | 'The Matcha Caves'
    | 'Fort Skeleton'
    | 'The Ninth Trash Hole of Hell'
