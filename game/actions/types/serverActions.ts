import type { Action, Func } from 'shared'

export type GameActions = { [K in keyof Action]: GameAction<Action[K]> }

type GameAction<T extends Func> = (
    args: Parameters<T>[0] & { game: Gamecursor }
) => ReturnType<T>
