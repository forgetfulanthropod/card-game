import type { ChangeScene, ChooseDoor, Dispatch, DoCharacterAction, GetRulebook, Hello, MakeNewUser, ServerResult, StartGame, } from '@shared/actions'

import { callWrap } from './call'

export function failIfError<S, T extends ServerResult<S>>(serverResult: T): S {
    if (serverResult.status === 'error') {
        throw Error(`server call error: ${serverResult.message}`)
    }
    return serverResult.result
}

export const hello = callWrap<Hello>('hello')
export const getRulebook = callWrap<GetRulebook>('getRulebook')
export const startGame = callWrap<StartGame>('startGame')
export const doCharacterAction = callWrap<DoCharacterAction>('doCharacterAction')
export const changeScene = callWrap<ChangeScene>('changeScene')
export const chooseDoor = callWrap<ChooseDoor>('chooseDoor')
export const dispatch = callWrap<Dispatch>('dispatch')
export const makeNewUser = callWrap<MakeNewUser>('makeNewUser')
