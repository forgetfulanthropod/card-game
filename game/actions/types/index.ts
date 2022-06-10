import type { Func, GameOnlyAction } from 'shared'

export type GameActions = {
    [K in keyof GameOnlyAction]: GameAction<GameOnlyAction[K]>
}

type GameAction<T extends Func> = (
    args: Parameters<T>[0] & { game: Gamecursor }
) => ReturnType<T>
