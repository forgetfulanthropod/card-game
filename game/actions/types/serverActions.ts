import type { Action, Func } from 'shared'

export type ServerActions = { [K in keyof Action]: ServerAction<Action[K]> }

type ServerAction<T extends Func> = (
    args: Objify<Parameters<T>[0]> & { username: string; socketId: string }
) => ReturnType<T>

type Objify<Type> = Type extends Obj ? Type : Record<string, never>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Obj = Record<string | number | symbol, any>
