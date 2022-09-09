import type { RequiredAction } from '@actions'
import type { SceneHas } from '@misc'
import type { CharacterUid } from './Character'
import type { Piles, Pile, Card, Command } from './Card'
import type { StatChangeMap } from './CardHit'
import type { Characters } from './Characters'
import type { CommandQueue } from './CommandQueue'
import type { ClaimableLoot } from '../Loot'

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
    isInMap: boolean
    isInRestSite: boolean
    lootEarned: ClaimableLoot
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

type BattleWinState =
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
