import type { Action, Func } from 'shared'

export type ServerActions = { [K in keyof Action]: ServerAction<Action[K]> }
export type GameActions = { [K in keyof Action]: GameAction<Action[K]> }

type GameAction<T extends Func> = (
    args: Parameters<T>[0] & { game: Gamecursor }
) => ReturnType<T>

type ServerAction<T extends Func> = (
    args: Parameters<T>[0] & { username: string; socketId: string }
) => ReturnType<T>
