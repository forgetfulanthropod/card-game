import type { Action, CharacterUid, OwnedCharacter, SceneName, ServerResult, SpecialDoorName } from '@shared'

import { callWrap } from './call'


type Empty = Record<string, never>


export const addSelected = callWrap<(args: { character: OwnedCharacter }) => void>('addSelected')
export const changeDungeon = callWrap<(args: { direction: -1 | 1 }) => void>('changeDungeon')
export const changeScene = callWrap<(args: { newSceneName: SceneName }) => void>('changeScene')
export const chooseDoor = callWrap<(args: { door: SpecialDoorName }) => void>('chooseDoor')
export const dispatch = callWrap<(action: Action) => void>('dispatch')
export const doCharacterAction = callWrap<(args: { uid: CharacterUid }) => void>('doCharacterAction')
export const echo = callWrap<(args: unknown) => unknown>('echo')
export const exitDungeon = callWrap<(args: Empty) => void>('exitDungeon')
export const hello = callWrap<(args: Empty) => 'hello'>('hello')
export const incrementTestCounter = callWrap<(args: Empty) => void>('incrementTestCounter')
export const makeNewUser = callWrap<(args: { username: 'alice' }) => void>('makeNewUser')
export const square = callWrap<(args: { n: string }) => number>('square')
export const startGame = callWrap<(args: Empty) => void>('startGame')
export const toggleStance = callWrap<(args: {characterUid: CharacterUid}) => void>('toggleStance')

export function failIfError<S, T extends ServerResult<S>>(serverResult: T): S {
    if (serverResult.status === 'error') {
        throw Error(`server call error: ${serverResult.message}`)
    }
    return serverResult.result
}
