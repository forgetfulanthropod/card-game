// @index('./*.ts', f => `export * from '${f.path}'`)
export * from './AddSelected'
export * from './ChangeDungeon'
export * from './ChangeScene'
export * from './ChooseDoor'
export * from './Dispatch'
export * from './DoCharacterAction'
export * from './ExitDungeon'
export * from './Hello'
export * from './IncrementTestCounter'
export * from './MakeNewUser'
export * from './ResetRandomSeed'
export * from './RulebookAction'
export * from './SetBlessings'
export * from './StartBattle'
export * from './ToggleStance'
// @endindex
declare global {
    type Empty = Record<string, never>
}
