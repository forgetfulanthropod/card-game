import type { BattleScene, EntryScene, Gamestate, OwnedCharacter, Scene } from '@shared'
import type { SCursor } from 'baobab'
import { SBaobab } from 'baobab'
import { memoize } from 'lodash'

import { listenForInitialGameState } from '@/connection/serverListener'


/** Global variables for file */
const state = {
    gamestate: null as SBaobab<Gamestate> | null,
}

export async function waitForGameStateToFill(): Promise<void> {
    state.gamestate = new SBaobab(await listenForInitialGameState())
    // @ts-expect-error for debugging:
    window.tree = state.gamestate
}


/** Do not call at the module-level
 * The pattern above with triggercallbacks etc lets us
 *  write synchronous code everywhere in app, we just need to
 *  wait for callbacks in onRulebook and onGamestate
 */
export function getTree(): SBaobab<Gamestate> {
    if (state.gamestate == null) {
        throw Error('tried to get tree before it was loaded. Did you wait for onGamestate?')
    }
    return state.gamestate
}

export const getBattleScene = (): SCursor<BattleScene> => {
    const sceneName = getTree().select('scene').get('name')
    if (sceneName !== 'battle') {
        throw new Error(`tried to get battle scene when you're in ${sceneName}`)
    }
    return getTree().select('scene') as SCursor<BattleScene>
}
export const getEntryScene = (): SCursor<EntryScene> => {
    const curType = getTree().select('scene').select('name').get()
    if (curType !== 'entry') {
        throw new Error(`tried to get entry scene when you're in ${curType}`)
    }
    return getTree().select('scene') as SCursor<EntryScene>
}

export const getOwnedCharacters = (): SCursor<Record<string, OwnedCharacter>> => getTree().select('ownedCharacters')
export const getScene = (): SCursor<Scene> => getTree().select('scene')
export const getBattleSceneData = (): BattleScene => getBattleScene().get()

export interface ClientTree {
    serverCalls: unknown[]
    modal: null | { title: string, body: string, onClose: Callback }
}
export const getClientTree: () => SBaobab<ClientTree> = memoize(() => {
    return new SBaobab<ClientTree>({
        serverCalls: [],
        modal: null,
    })
})

// @ts-ignore
window.clientTree = getClientTree()
