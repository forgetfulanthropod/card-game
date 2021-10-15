import type { CharacterMeta, CharacterMove, CharacterUid, Door, Rulebook, SceneName } from '.'

// NOTE: if we keep all args as strings then we can test in URL bar more easily
// I think returning data is fine
export type Hello = (args: Empty) => 'hello'
export type Square = (args: { n: string }) => number
export type Echo<T extends Empty> = (args: T) => T // eslint-disable-line @typescript-eslint/ban-types

export type ChangeScene = (args: { newSceneName: SceneName }) => void
export type ChooseDoor = (args: { door: Door }) => void
export type GetRulebook = (args: Empty) => Rulebook
export type StartGame = (args: Empty) => void
export type DoCharacterAction = (args: { uid: CharacterUid }) => void
export type MakeNewUser = (args: { username: 'alice' }) => void
export type Dispatch = (action: Action) => Promise<void>


type Empty = Record<string, never>

// export interface AllActions { // used by server to check if it implemented them all
// }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Func = (...args: any[]) => any
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
    | { a: 'setHasMoved', uid: string, v: boolean }
    | { a: 'setHealth', uid: string, h: Setter<number> }
    | { a: 'clearHasMoved' }
    | { a: 'setSelectedCharacter', c: CharacterMeta }
    | { a: 'setSelectedMove', m: CharacterMove }
    | { a: 'fullReset' }
    | { a: 'updateScreenSize', size: Size }
    | { a: 'setIsBasicLoaded', v: boolean }
    | { a: 'setIsDeluxeLoaded', v: boolean }
