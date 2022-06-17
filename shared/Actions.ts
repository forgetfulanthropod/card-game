/** All server and game (including internal) actions.
 * They all return void when called.
 */

import type { SCursor } from 'sbaobab'
import type { SceneId } from './misc'

import type {
    CardUid,
    CharacterUid,
    Gamestate,
    Orb,
    OwnedCharacterStats,
    Rulebook,
} from './tree'

interface BareServerActionArgs {
    incrementTestCounter: Empty
    makeNewUser: { username: string }
    maybeMakeUser: { username: string }
}

interface BareGameActionArgs {
    activateOrb: { characterUid: CharacterUid; orb: Orb }
    addCardToDeck: { cardUid: CardUid }
    changeDungeon: { direction: -1 | 1 }
    changeScene: { newSceneName: SceneId }
    endTurn: Empty
    exitDungeon: Empty
    finishCard: { cardUids: CardUid[] }
    nextRoom: Empty
    placeSelectedCharacters: {
        characters: {
            character: OwnedCharacterStats
            index: CharacterPlaceIndex
        }[]
    }
    playCard: { cardUid: string; targetUids: CharacterUid[] }
    resetRandomSeed: Empty
    rulebookAction: RulebookArgs
    toggleStance: { characterUid: CharacterUid }
}

// NOTE: below is not as complicated as it looks.
// The pattern is making an interface, then unioning its properties.
// This lets us get highly specific types without repeating ourselves or using generics.

/** Map from game action name to function signature */
export type GameActions = {
    [K in keyof BareGameActionArgs]: (
        args: BareGameActionArgs[K] & { game: Gamecursor }
    ) => void
}
/** Map from server action name to function signature */
export type ServerActions = {
    [K in keyof BareServerActionArgs]: (
        args: BareServerActionArgs[K]
    ) => Promise<void> | void
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

export type Gamecursor = SCursor<Gamestate>

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
