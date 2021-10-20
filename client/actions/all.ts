import type { ClientActions, ServerResult } from '@shared/actions'

import { callWrap } from './call'

const clientActions: ClientActions = {
    hello: callWrap('hello'),
    square: callWrap('square'),
    echo: callWrap('echo'),
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
    startGame: callWrap('startGame'),
    doCharacterAction: callWrap('doCharacterAction'),
    changeScene: callWrap('changeScene'),
    changeDungeon: callWrap('changeDungeon'),
    addSelected: callWrap('addSelected'),
    chooseDoor: callWrap('chooseDoor'),
    dispatch: callWrap('dispatch'),
    makeNewUser: callWrap('makeNewUser'),
    exitDungeon: callWrap('exitDungeon')
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
} = clientActions

export function failIfError<S, T extends ServerResult<S>>(serverResult: T): S {
    if (serverResult.status === 'error') {
        throw Error(`server call error: ${serverResult.message}`)
    }
    return serverResult.result
}
