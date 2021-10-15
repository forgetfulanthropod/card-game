import type { Caller, ChangeScene, ChooseDoor, Dispatch, DoCharacterAction, GetRulebook, Hello, ServerResult, StartGame, } from '@shared/actions'

import { call } from './call'

export function failIfError<S, T extends ServerResult<S>>(serverResult: T): S {
    if (serverResult.status === 'error') {
        throw Error(`server call error: ${serverResult.message}`)
    }
    return serverResult.result
}

export const hello: Caller<Hello> = async () => await call<Hello>('hello')

export const getRulebook: Caller<GetRulebook> = async () => {
    return await call<GetRulebook>('getRulebook')
}

export const startGame: Caller<StartGame> = async () => await call<StartGame>('startGame')
export const doCharacterAction: Caller<DoCharacterAction> = async (uid) => await call<DoCharacterAction>('DoCharacterAction', uid)

export const changeScene: Caller<ChangeScene> = async (newSceneName) => call<ChangeScene>('changeScene', newSceneName)
export const chooseDoor: Caller<ChooseDoor> = async (door) => call<ChooseDoor>('chooseDoor', door)
export const dispatch: Caller<Dispatch> = async (action) => call<Dispatch>('dispatch', action)
