import type { Action, Func } from 'shared'

export type ServerActions = { [K in keyof Action]: ServerAction<Action[K]> }

type ServerAction<T extends Func> = (
    args: Objify<Parameters<T>[0]> & { username: string; socketId: string }
) => ReturnType<T>

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Empty {}
type Objify<Type> = Type extends Obj ? Type : Empty

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Obj = Record<string | number | symbol, any>
