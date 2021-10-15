import type { CharacterMeta, CharacterMove, Door, SceneName } from '.'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Func = (...args: any[]) => any
export type Caller<F extends Func> = (...args: Parameters<F>) => Promise<CallReturn<F>>
export type CallReturn<F extends Func> = { status: 'success', result: ReturnType<F> } | { status: 'error', message: string }
export type ChangeScene = (newSceneName: SceneName) => void
export type PutUpDoors = () => void
export type ChooseDoor = (door: Door) => void


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
