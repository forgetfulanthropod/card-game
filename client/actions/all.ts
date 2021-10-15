import type { ChangeScene, ChooseDoor, Dispatch, DoCharacterAction, Echo, GetRulebook, Hello, MakeNewUser, ServerResult, Square, StartGame, } from '@shared/actions'
import type { Rulebook } from '@shared/index'

import { callWrap } from './call'

export const hello = callWrap<Hello>('hello')
export const square = callWrap<Square>('square')
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const echo = callWrap<Echo<any>>('echo')

/** This function is more complex cuz I really wanted to check return type.
 *  Can make this simpler if we use some run-time type checking library such as woutervh-/typescript-is.
 */
export const getRulebookAsync = async (): Promise<Rulebook> => {
    const response = await callWrap<GetRulebook>('getRulebook')({})
    if (response.status === 'error') {
        throw Error(`error getting rulebook from server: ${response.message}`)
    }
    if (response.result.characters == null) {
        throw Error('got rulebook from server but had null characters property so there was probably a server error')
    }
    return response.result
}
export const startGame = callWrap<StartGame>('startGame')
export const doCharacterAction = callWrap<DoCharacterAction>('doCharacterAction')
export const changeScene = callWrap<ChangeScene>('changeScene')
export const chooseDoor = callWrap<ChooseDoor>('chooseDoor')
export const dispatch = callWrap<Dispatch>('dispatch')
export const makeNewUser = callWrap<MakeNewUser>('makeNewUser')

export function failIfError<S, T extends ServerResult<S>>(serverResult: T): S {
    if (serverResult.status === 'error') {
        throw Error(`server call error: ${serverResult.message}`)
    }
    return serverResult.result
}
