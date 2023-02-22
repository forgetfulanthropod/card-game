import type { RequiredAction } from '@actions'
import type { SceneHas } from '@misc'
import type {
    DungeonRoom,
    DungeonRoomMap,
    DungeonRoomMaps,
    RoomUid,
} from '../Dungeon'

import type { CharacterUid } from './Character'
import type { Piles, Pile, Card, Command } from './Card'
import type { StatChangeMap } from './CardHit'
import type { Characters, StanceId } from './Characters'
import type { CommandQueue } from './CommandQueue'
import type {
    ClaimableLoot,
    ClaimedLoot,
    TreasureChest,
    RunScore,
    RunScoreUpdate,
    RunScoreAttributeName,
} from '.'
import { RunID } from '../User'
import { EventScene } from '../EventScene'
import { Souvenir } from '../Souvenir'

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
    handSize: number
    baseHandSize: number
    energy: number
    roundEnergy: number
    isBasicLoaded: boolean
    isDeluxeLoaded: boolean
    turnCount: number
    rooms: DungeonRoomMap
    roomUidsVisited: RoomUid[]
    numRoomsPassed: number
    currentRoom: DungeonRoom
    currentEvent?: EventScene
    nextNpcCommands: NextCommand[]
    cardsPlayedThisRoom: (Card & { timestamp: string })[]
    cardsPlayedThisTurn: (Pick<Card, 'characterUid' | 'uid'> & {
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
    isInMap: boolean
    isInRestSite: boolean
    isInEventScene: boolean
    lootEarned: ClaimableLoot
    lootClaimed: ClaimedLoot
    lootScreenHasOpened: boolean
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

export type DungeonName =
    | 'Skelepit Dungeon'
    | 'Hooligans Bluff'
    | 'The Matcha Caves'
    | 'Fort Skeleton'
    | 'The Ninth Trash Hole of Hell'
