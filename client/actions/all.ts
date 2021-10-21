import type { ClientActions, ServerResult } from '@shared/actions'

import { callWrap } from './call'

const clientActions: ClientActions = {
    hello: callWrap('f-hello'),
    square: callWrap('f-square'),
    echo: callWrap('f-echo'),
    // getOwnedCharacters: callWrap('getOwnedCharacters'),
    /** This function is more complex cuz I really wanted to check return type.
     *  Can make this simpler if we use some run-time type checking library such as woutervh-/typescript-is.
     */
    // getRulebookAsync: async (): Promise<Rulebook> => {
    //     const response = await callWrap<(eo: EmptyObject) => Rulebook>('getRulebook')({})
    //     if (response.status === 'error') {
    //         throw Error(`error getting rulebook from server: ${response.message}`)
    //     }
    //     if (response.result.characters == null) {
    //         throw Error('got rulebook from server but had null characters property so there was probably a server error')
    //     }
    //     return response.result
    // },
    startGame: callWrap('f-startGame'),
    doCharacterAction: callWrap('f-doCharacterAction'),
    changeScene: callWrap('f-changeScene'),
    changeDungeon: callWrap('f-changeDungeon'),
    addSelected: callWrap('f-addSelected'),
    chooseDoor: callWrap('f-chooseDoor'),
    dispatch: callWrap('f-dispatch'),
    makeNewUser: callWrap('f-makeNewUser'),
    exitDungeon: callWrap('f-exitDungeon'),
    incrementTestCounter: callWrap('f-incrementTestCounter'),
}

// @ts-ignore for debugging:
window.actions = clientActions

export const {
    hello,
    square,
    echo,
    // getRulebookAsync,
    startGame,
    doCharacterAction,
    changeScene,
    changeDungeon,
    addSelected,
    chooseDoor,
    dispatch,
    makeNewUser,
    exitDungeon,
    incrementTestCounter,
} = clientActions

export function failIfError<S, T extends ServerResult<S>>(serverResult: T): S {
    if (serverResult.status === 'error') {
        throw Error(`server call error: ${serverResult.message}`)
    }
    return serverResult.result
}
