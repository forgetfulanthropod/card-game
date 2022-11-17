import type { RequiredAction } from '@actions'
import type { SceneHas } from '@misc'
import type { DungeonRoom, DungeonRoomMap, DungeonRoomMaps } from '../Dungeon'

import type { CharacterUid } from './Character'
import type { Piles, Pile, Card, Command } from './Card'
import type { StatChangeMap } from './CardHit'
import type { Characters, StanceId } from './Characters'
import type { CommandQueue } from './CommandQueue'
import type { ClaimableLoot, ClaimedLoot, TreasureChest, RunScore } from '.'

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
    roundEnergy: number
    isBasicLoaded: boolean
    isDeluxeLoaded: boolean
    turnCount: number
    rooms: DungeonRoomMap
    numRoomsPassed: number
    currentRoom: DungeonRoom
    nextNpcCommands: NextCommand[]
    cardsPlayedThisRoom: (Card & { timestamp: string })[]
    cardsPlayedThisTurn: (Pick<Card, 'characterUid' | 'uid'> & {
        timestamp: string
    })[]
    blocksAppliedThisTurn: { amount: number; targetUid: CharacterUid }[]
    stanceChangesThisRoom: { newStance: StanceId; targetUid: CharacterUid }[]
    damagesDealtThisTurn: { amount: number; targetUid: CharacterUid }[]
    damagesDealtThisRoom: { amount: number; targetUid: CharacterUid }[]
    requireAction: RequiredAction | null
    queue: CommandQueue
    isInMap: boolean
    isInRestSite: boolean
    lootEarned: ClaimableLoot
    lootClaimed: ClaimedLoot
    lootScreenHasOpened: boolean
    endScreenHasOpened: boolean
    treasureChest: TreasureChest
    runScore: RunScore
    runDuration: {
        startTime: string
        endTime: string | null
    }
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

export type BattleWinState =
    | 'in battle'
    | 'won'
    | 'lost'
    | 'collecting loot'
    | 'choosing cards'

export type DungeonName =
    | 'Skelepit Dungeon'
    | 'Hooligan’s Bluff'
    | 'The Matcha Caves'
    | 'Fort Skeleton'
    | 'The Ninth Trash Hole of Hell'
