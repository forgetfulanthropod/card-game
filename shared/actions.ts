import type { AttackData, CharacterMeta, CharacterMove, CharacterUid, Door, Rulebook, SceneName } from '.'
import type { OwnedCharacter } from './datamodel'

// NOTE: if we keep all args as strings then we can test in URL bar more easily
// I think returning data as other kinds of values is fine.
// I couldn't find a less verbose way to do this.
// To add a function, add it three times here, twice in actions/functions.ts, and twice in client/actions/all.ts. (seven total lol)
type Hello = (args: Empty) => 'hello'
type Square = (args: { n: string }) => number
type Echo = <T extends Empty>(args: T) => T // eslint-disable-line @typescript-eslint/ban-types
type GetOwnedCharacters = (args: Empty) => Promise<Record<CharacterUid, OwnedCharacter>>
type ChangeScene = (args: { newSceneName: SceneName }) => void
type ChangeDungeon = (args: { direction: -1 | 1 }) => void
type AddSelected = (args: { character: OwnedCharacter }) => void
type ChooseDoor = (args: { door: Door }) => void
type GetRulebook = (args: Empty) => Rulebook
type StartGame = (args: Empty) => void
type DoCharacterAction = (args: { uid: CharacterUid }) => void
type MakeNewUser = (args: { username: 'alice' }) => void
export type Dispatch = (action: Action) => Promise<void>
export interface ServerActions {
    hello: Hello
    square: Square
    echo: Echo
    changeScene: ChangeScene
    getOwnedCharacters: GetOwnedCharacters
    chooseDoor: ChooseDoor
    getRulebook: GetRulebook
    startGame: StartGame
    doCharacterAction: DoCharacterAction
    makeNewUser: MakeNewUser
    dispatch: Dispatch
    changeDungeon: ChangeDungeon
    addSelected: AddSelected
}

// I think there must be some kind of mapped interface via indexed types but idk how.
export interface ClientActions {
    hello: Caller<Hello>
    square: Caller<Square>
    echo: Caller<Echo>
    getOwnedCharacters: Caller<GetOwnedCharacters>
    changeScene: Caller<ChangeScene>
    chooseDoor: Caller<ChooseDoor>
    startGame: Caller<StartGame>
    doCharacterAction: Caller<DoCharacterAction>
    makeNewUser: Caller<MakeNewUser>
    dispatch: Caller<Dispatch>
    getRulebookAsync(): Promise<Rulebook>
    changeDungeon: Caller<ChangeDungeon>
    addSelected: Caller<AddSelected>
}


type Empty = Record<string, never>

// export interface AllActions { // used by server to check if it implemented them all
// }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Func = (...args: any[]) => any
export type Caller<F extends Func> = (...args: Parameters<F>) => Promise<CallReturn<F>>
export type CallReturn<F extends Func> = ServerResult<ReturnType<F>>
export type ServerResult<T> = { status: 'success', result: T } | { status: 'error', message: string }

// Dispatch:

type Size = {
    width: number
    height: number
}

type Setter<T> = T | ((old: T) => T)
export type Action =
    | { a: 'setIsPlayerTurn', v: boolean }
    | { a: 'setBattleHasBegun' }
    | { a: 'move', d: AttackData }
    | { a: 'setHasMoved', uid: string, v: boolean }
    | { a: 'setHealth', uid: string, h: Setter<number> }
    | { a: 'clearHasMoved' }
    | { a: 'setSelectedCharacter', c: CharacterMeta }
    | { a: 'setSelectedMove', m: CharacterMove }
    | { a: 'fullReset' }
    | { a: 'updateScreenSize', size: Size }
    | { a: 'setIsBasicLoaded', v: boolean }
    | { a: 'setIsDeluxeLoaded', v: boolean }
