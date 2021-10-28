import type { ServerResult } from '@shared'
import type * as AllTypes from '@shared/actions'

import { callWrap } from './call'

// @index(['../../shared/actions/*.ts', '!../../shared/actions/index.ts'], f => `export const ${f.name.replace(/\b\w/g, c => c.toLowerCase())} = callWrap<AllTypes.${f.name}>('${f.name.replace(/\b\w/g, c => c.toLowerCase())}')`)
export const addSelected = callWrap<AllTypes.AddSelected>('addSelected')
export const changeDungeon = callWrap<AllTypes.ChangeDungeon>('changeDungeon')
export const changeScene = callWrap<AllTypes.ChangeScene>('changeScene')
export const chooseDoor = callWrap<AllTypes.ChooseDoor>('chooseDoor')
export const dispatch = callWrap<AllTypes.Dispatch>('dispatch')
export const doCharacterAction = callWrap<AllTypes.DoCharacterAction>('doCharacterAction')
export const echo = callWrap<AllTypes.Echo>('echo')
export const exitDungeon = callWrap<AllTypes.ExitDungeon>('exitDungeon')
export const hello = callWrap<AllTypes.Hello>('hello')
export const incrementTestCounter = callWrap<AllTypes.IncrementTestCounter>('incrementTestCounter')
export const makeNewUser = callWrap<AllTypes.MakeNewUser>('makeNewUser')
export const square = callWrap<AllTypes.Square>('square')
export const startGame = callWrap<AllTypes.StartGame>('startGame')
export const toggleStance = callWrap<AllTypes.ToggleStance>('toggleStance')
// @endindex


// export const changeDungeon = callWrap<(args: { direction: -1 | 1 }) => void>('changeDungeon')
// export const changeScene = callWrap<(args: { newSceneName: SceneName }) => void>('changeScene')
// export const chooseDoor = callWrap<(args: { door: SpecialDoorName }) => void>('chooseDoor')
// export const dispatch = callWrap<(action: Action) => void>('dispatch')
// export const doCharacterAction = callWrap<(args: { uid: CharacterUid }) => void>('doCharacterAction')
// export const echo = callWrap<(args: unknown) => unknown>('echo')
// export const exitDungeon = callWrap<(args: Empty) => void>('exitDungeon')
// export const hello = callWrap<(args: Empty) => 'hello'>('hello')
// export const incrementTestCounter = callWrap<(args: Empty) => void>('incrementTestCounter')
// export const makeNewUser = callWrap<(args: { username: 'alice' }) => void>('makeNewUser')
// export const square = callWrap<(args: { n: string }) => number>('square')
// export const startGame = callWrap<(args: Empty) => void>('startGame')
// export const toggleStance = callWrap<(args: { characterUid: CharacterUid }) => void>('toggleStance')

export function failIfError<S, T extends ServerResult<S>>(serverResult: T): S {
    if (serverResult.status === 'error') {
        throw Error(`server call error: ${serverResult.message}`)
    }
    return serverResult.result
}
