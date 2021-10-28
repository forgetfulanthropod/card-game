import type { BattleScene, EntryScene, Gamestate, MyCursor, OwnedCharacter, Scene } from '@shared'
import { MyBaobab } from '@shared'
import { memoize } from 'lodash'

import { listenForInitialGameState } from '@/connection/serverListener'


/** Global variables for file */
const state = {
    gamestate: null as MyBaobab<Gamestate> | null,
}

export async function waitForGameStateToFill(): Promise<void> {
    state.gamestate = new MyBaobab(await listenForInitialGameState())
    // @ts-ignore for debugging:
    window.tree = state.gamestate
}


/** Do not call at the module-level
 * The pattern above with triggercallbacks etc lets us
 *  write synchronous code everywhere in app, we just need to
 *  wait for callbacks in onRulebook and onGamestate
 */
export function getTree(): MyBaobab<Gamestate> {
    if (state.gamestate == null) {
        throw Error('tried to get tree before it was loaded. Did you wait for onGamestate?')
    }
    return state.gamestate
}

export const getBattleScene = (): MyCursor<BattleScene> => {
    const sceneName = getTree().select('scene').get('name')
    if (sceneName !== 'battle') {
        throw new Error(`tried to get battle scene when you're in ${sceneName}`)
    }
    return getTree().select('scene') as MyCursor<BattleScene>
}
export const getEntryScene = (): MyCursor<EntryScene> => {
    const curType = getTree().select('scene').select('name').get()
    if (curType !== 'entry') {
        throw new Error(`tried to get entry scene when you're in ${curType}`)
    }
    return getTree().select('scene') as MyCursor<EntryScene>
}

export const getOwnedCharacters = (): MyCursor<Record<string, OwnedCharacter>> => getTree().select('ownedCharacters')
export const getScene = (): MyCursor<Scene> => getTree().select('scene')
export const getBattleSceneData = (): BattleScene => getBattleScene().get()


interface ClientTree {
    serverCalls: unknown[]
}
export const getClientTree: () => MyBaobab<ClientTree> = memoize(() => {
    return new MyBaobab<ClientTree>({
        serverCalls: [],
    })
})

// @ts-ignore
window.clientTree = getClientTree()

// @ts-ignore
window.copyHistory = async () => {
    await navigator.clipboard.writeText(JSON.stringify(getClientTree().get().serverCalls))
    console.log('copied!')
}
