import type { Caller, ChangeScene, ChooseDoor, Dispatch } from '@shared/actions'
import type { Rulebook } from '@shared/datamodel'

import { call } from './call'

export async function helloWorld(): Promise<void> {
    await call('hello', undefined)
}

export async function getRulebook(): Promise<Rulebook> {
    return null as unknown as Rulebook
}

export function startGame(): void { }
export function doCharacterAction(): void { }

export const changeScene: Caller<ChangeScene> = async (newSceneName) => call<ChangeScene>('changeScene', newSceneName)
export const chooseDoor: Caller<ChooseDoor> = async (door) => call<ChooseDoor>('chooseDoor', door)
export const dispatch: Caller<Dispatch> = async (action) => call<Dispatch>('dispatch', action)
