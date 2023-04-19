/** All server and game (including internal) actions.
 * They all return void when called.
 */

import type { SCursor } from 'sbaobab'
import type { SceneId } from './misc'

import type {
    BattleScene,
    Card,
    CardUid,
    CharacterUid,
    GameState,
    MappedLeaderboards,
    Orb,
    Rulebook,
    RunID,
    SouvenirId,
    StanceId,
    UserID,
    UserInfo,
    Username,
} from './tree'

export interface BareServerActionsMeta {
    incrementTestCounter: {
        args: Empty
        res: Promise<void>
    }
    setInitialGameState: {
        args: { username: string }
        res: void
    }
    loadGameState: {
        args: { username: string }
        res: Promise<void>
    }
    login: {
        args: { walletAddress: string }
        res: Promise<UserInfo & { accessToken: string }>
    }
    startRun: {
        args: { userId: UserID }
        res: Promise<{ runId: RunID }>
    }
    getCurrentRun: {
        args: { userId: UserID }
        res: Promise<{ runId: RunID } | null>
    }
    endRun: {
        args: { userId: UserID; restart?: true }
        res: Promise<{ runId: RunID | null }>
    }
    getNumKaijuInGoodEarth: {
        args: { walletAddress: string }
        res: Promise<{ numKaijuOwned: number }>
    }
    getLeaderboard: {
        args: { userId: UserID }
        res: Promise<MappedLeaderboards>
    }
    getLeaderboardEntryCount: {
        args: Empty
        res: Promise<{ count: number }>
    }
    setUsername: {
        args: { userId: UserID; username: Username }
        res: Promise<{ result: 'success' | 'failure' }>
    }
    getNonce: {
        args: Empty
        res: Promise<{nonce: string}>
    }
}

export type BareServerActionArgs = {
    [K in keyof BareServerActionsMeta]: BareServerActionsMeta[K]['args']
}

interface BareGameActionArgs {
    activateOrb: { characterUid: CharacterUid; orb: Orb }
    addCardToDeck: { cardUid: CardUid }
    collectLoot: Empty
    changeDungeon: { direction: -1 | 1 }
    changeScene: { newSceneName: SceneId }
    discard: { cardUids: CardUid[] }
    endTurn: Empty
    exitDungeon: Empty
    finishCard: { cardUids: CardUid[] }
    openEndOfRoom: Empty
    openEndOfRun: Empty
    nextRoom: { choice: 0 | 1 | 2 | 3 }
    choosePlushy: { index: number }
    chooseEventResponse: { index: number; characterUid?: CharacterUid }

    activateSouvenir: { souvenirId: SouvenirId }
    placeSelectedCharacters: {
        characters: {
            allCharacterOptionsIndex: number
            placeIndex: CharacterPlaceIndex
        }[]
    }
    rollKaiju: {
        placeIndex: CharacterPlaceIndex
    }
    playCard: { cardUid: string; targetUids: CharacterUid[] }
    resetRandomSeed: Empty
    chooseStance: { characterUid: CharacterUid; stanceId: StanceId }
    setRunId: { userId: UserID; runId: RunID }

    //test only start
    getFreeSouvenir: { souvenirId: SouvenirId; characterUid?: CharacterUid }
    getFreeCard: { card: Card }
    removeCardForFree: { uid: CardUid }

    rulebookAction: RulebookArgs
    setBattleScene: { scene: BattleScene }
    //test only end
}

// NOTE: below is not as complicated as it looks.
// The pattern is making an interface, then unioning its properties.
// This lets us get highly specific types without repeating ourselves or using generics.

/** Map from game action name to function signature */
export type GameActions = {
    [K in keyof BareGameActionArgs]: (
        args: BareGameActionArgs[K] & { game: Gamecursor; username?: string }
    ) => void
}
/** Map from server action name to function signature */
export type ServerActions = {
    [K in keyof BareServerActionsMeta]: (
        args: BareServerActionsMeta[K]['args']
    ) => BareServerActionsMeta[K]['res']
}

// export type GameActionArgs = {
//     [K in keyof BareGameActionArgs]: BareGameActionArgs[K] & { method: K }
// }

/** An argument to game's main takeAction() export */
type ToGameActionCall = {
    [K in keyof BareGameActionArgs]: BareGameActionArgs[K] & {
        method: K
        game: Gamecursor
    }
}
export type GameActionCall = ToGameActionCall[keyof ToGameActionCall]

export type AllActionArgs = BareServerActionArgs & BareGameActionArgs

/** Name of any action */
export type ActionName = keyof BareGameActionArgs | keyof BareServerActionArgs

/** A no-input game action */
interface BareInternalActionArgs {
    doNpcTurn: { index: number }
    activatePlayCardHooks: { card: Card }
    endNpcTurn: Empty
}

/** Map from internal action name to function signature */
export type InternalActions = {
    [K in keyof BareInternalActionArgs]: (
        args: BareInternalActionArgs[K] & { game: Gamecursor }
    ) => void
}

type ToNextAction = {
    [K in keyof BareInternalActionArgs]: BareInternalActionArgs[K] & {
        method: K
        delay: number
    }
}

/** Next internal action, stored in Gamestate */
export type NextAction = ToNextAction[keyof ToNextAction]

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Empty {}

export type CallReturn =
    | { status: 'success' }
    | { status: 'error'; message: string }

export type Gamecursor = SCursor<GameState>

// ======= Little types for specific actions =======

export type RequiredActionName = 'discardHand' | 'removeRoom' | 'discardDraw'

export interface RequiredAction {
    type: RequiredActionName
    least: number
    most: number
}

type RulebookArgs =
    | { do: 'new'; rulebook: Rulebook }
    | { do: 'delete'; name: string }
    | { do: 'choose'; name: string }

export type CharacterPlaceIndex = 0 | 1 | 2
