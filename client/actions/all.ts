import type * as AllTypes from '@shared/actions'
import type { ServerResult } from '@shared/actions'

import { callWrap } from './call'


// @index(['../../shared/actions/*.ts', '!../../shared/actions/index.ts'], f => `export const ${f.name.replace(/\b\w/g, c => c.toLowerCase())} = callWrap<AllTypes.${f.name}>('${f.name.replace(/\b\w/g, c => c.toLowerCase())}')`)
export const addSelected = callWrap<AllTypes.AddSelected>('addSelected')
export const changeDungeon = callWrap<AllTypes.ChangeDungeon>('changeDungeon')
export const changeScene = callWrap<AllTypes.ChangeScene>('changeScene')
export const chooseDoor = callWrap<AllTypes.ChooseDoor>('chooseDoor')
export const doCharacterAction = callWrap<AllTypes.DoCharacterAction>('doCharacterAction')
export const exitDungeon = callWrap<AllTypes.ExitDungeon>('exitDungeon')
export const hello = callWrap<AllTypes.Hello>('hello')
export const incrementTestCounter = callWrap<AllTypes.IncrementTestCounter>('incrementTestCounter')
export const makeNewUser = callWrap<AllTypes.MakeNewUser>('makeNewUser')
export const resetRandomSeed = callWrap<AllTypes.ResetRandomSeed>('resetRandomSeed')
export const rulebookAction = callWrap<AllTypes.RulebookAction>('rulebookAction')
export const selectMove = callWrap<AllTypes.SelectMove>('selectMove')
export const startBattle = callWrap<AllTypes.StartBattle>('startBattle')
export const toggleBlessing = callWrap<AllTypes.ToggleBlessing>('toggleBlessing')
export const toggleStance = callWrap<AllTypes.ToggleStance>('toggleStance')
// @endindex

export function failIfError<S, T extends ServerResult<S>>(serverResult: T): S {
    if (serverResult.status === 'error') {
        throw Error(`server call error: ${serverResult.message}`)
    }
    return serverResult.result
}
