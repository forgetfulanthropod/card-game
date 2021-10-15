import type { CharacterMeta, CharacterMove, CharacterUid, Door, Rulebook, SceneName } from '.'

// export interface AllActions { // used by server to check if it implemented them all
// }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Func = (...args: any[]) => any
export type Caller<F extends Func> = (...args: Parameters<F>) => Promise<CallReturn<F>>
export type CallReturn<F extends Func> = ServerResult<ReturnType<F>>
export type ServerResult<T> = { status: 'success', result: T } | { status: 'error', message: string }
export type ChangeScene = (newSceneName: SceneName) => void
export type ChooseDoor = (door: Door) => void
export type Hello = () => 'hello'
export type GetRulebook = () => Rulebook
export type StartGame = () => void
export type DoCharacterAction = (uid: CharacterUid) => void
export type MakeNewUser = (username: 'alice') => void
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

export type Dispatch = (action: Action) => Promise<void>
