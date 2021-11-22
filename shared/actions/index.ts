// @index('./*.ts', f => `export * from '${f.path}'`)
export * from './AddSelected'
export * from './ChangeDungeon'
export * from './ChangeScene'
export * from './ChooseDoor'
export * from './DoCharacterAction'
export * from './ExitDungeon'
export * from './Hello'
export * from './IncrementTestCounter'
export * from './MakeNewUser'
export * from './MaybeMakeUser'
export * from './ResetRandomSeed'
export * from './RulebookAction'
export * from './SelectMove'
export * from './StartBattle'
export * from './ToggleBlessing'
export * from './ToggleStance'
// @endindex

export type Func = (...args: any[]) => any

// eslint-disable-line @typescript-eslint/no-explicit-any
export type Caller<F extends Func> = (...args: Parameters<F>) => Promise<CallReturn<F> | null>

type CallReturn<F extends Func> = ServerResult<ReturnType<F>>

export type ServerResult<T> = { status: 'success', result: T } | { status: 'error', message: string }
