import type { CharacterMove } from '.'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Func = (...args: any[]) => any
export type Caller<F extends Func> = (...args: Parameters<F>) => Promise<CallReturn<F> | null>
export type CallReturn<F extends Func> = ServerResult<ReturnType<F>>
export type ServerResult<T> = { status: 'success', result: T } | { status: 'error', message: string }

// Dispatch:

type Size = {
    width: number
    height: number
}

export type Action =
    | { a: 'setSelectedMove', m: CharacterMove }
    | { a: 'fullReset' }
    | { a: 'updateScreenSize', size: Size }
    | { a: 'setIsBasicLoaded', v: boolean }
    | { a: 'setIsDeluxeLoaded', v: boolean }
