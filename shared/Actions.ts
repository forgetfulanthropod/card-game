import type { SCursor } from 'sbaobab'

import type { CharacterUid, Gamestate } from './datamodel'
import type {
    CardUid,
    Orb,
    OwnedCharacterStats,
    Rulebook,
    SceneType,
} from './index'

/** A server action */
export interface Action {
    ActivateOrb: (_: { characterUid: CharacterUid; orb: Orb }) => void

    PlaceSelectedCharacters: (_: {
        characters: {
            character: OwnedCharacterStats
            index: CharacterPlaceIndex
        }[]
    }) => void
    ChangeDungeon: (_: { direction: -1 | 1 }) => void

    ChangeScene: (_: { newSceneName: SceneType }) => void

    NextRoom: (_: Empty) => void

    EndTurn: (_: Empty) => void
    ExitDungeon: (_: Empty) => void
    Hello: (_: Empty) => string
    IncrementTestCounter: (_: Empty) => void
    MakeNewUser: (_: { username: string }) => void

    MaybeMakeUser: (_: { username: string }) => Gamestate

    PlayCard: (_: { cardUid: string; targetUids: CharacterUid[] }) => void
    AddCardToDeck: (_: { cardUid: CardUid }) => void
    ResetRandomSeed: (_: Empty) => void

    RulebookAction: (_: RulebookArgs) => void

    ToggleStance: (_: { characterUid: CharacterUid }) => void
}

export type Gamecursor = SCursor<Gamestate>
/** A no-input game action */
export interface InternalAction {
    doNpcTurn(game: Gamecursor, args: { index: number }): undefined | NextAction
    endNpcTurn(game: Gamecursor, args: Empty): void
}
export type InternalActionName = keyof InternalAction
/** Means there is nothing for the player to do right now. */
export type NextAction<K extends InternalActionName = InternalActionName> = {
    type: K
    delay: number
    args: Param1<InternalAction[K]>
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Param1<T extends (...args: any[]) => any> = Parameters<T>[1]

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Empty {}

export type CharacterPlaceIndex = 0 | 1 | 2

type RulebookArgs =
    | { do: 'new'; rulebook: Rulebook }
    | { do: 'delete'; name: string }
    | { do: 'choose'; name: string }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Func = (..._: any[]) => any

export type CallReturn<F extends Func> = ServerResult<ReturnType<F>>

type ServerResult<T> =
    | { status: 'success'; result: T }
    | { status: 'error'; message: string }
