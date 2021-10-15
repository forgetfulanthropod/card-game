import type { BattleScene } from '@shared/battleTypes'
import type { Gamestate, MyCursor, Rulebook } from '@shared/index'
import { MyBaobab } from '@shared/myBaobab'

import { getRulebookAsync } from '@/actions'
import { getGameState } from '@/fire/firestoreListener'

import type { Scene } from './types'

/** Global variables for file */
const state = {
    gamestate: null as MyBaobab<Gamestate> | null,
    rulebook: null as Rulebook | null,
    gameStateCallbacks: [] as Callback[],
    rulebookCallbacks: [] as Callback[],
}

export function onGamestate(cb: Callback): void {
    state.gameStateCallbacks.push(cb)
}
export function onRulebook(cb: Callback): void {
    state.rulebookCallbacks.push(cb)
}

(async function triggerCallbacks() {
    state.gamestate = new MyBaobab(await getGameState())
    // @ts-ignore for debugging:
    window.tree = state.gamestate
    for (const cb of state.gameStateCallbacks) { cb() }
    state.gameStateCallbacks = []
    state.rulebook = await getRulebookAsync()
    for (const cb of state.rulebookCallbacks) { cb() }
    state.rulebookCallbacks = []
})()


/** The pattern above with triggercallbacks etc lets us
 *  write synchronous code everywhere in app, we just need to
 *  wait for callbacks in onRulebook and onGamestate
 */
export function getTree(): MyBaobab<Gamestate> {
    if (state.gamestate == null) {
        throw Error('tried to get tree before it was loaded. Did you wait for onGamestate?')
    }
    return state.gamestate
}

export function getRulebook(): Rulebook {
    if (state.rulebook == null) {
        throw Error('tried to get rulebook before it was loaded. Did you wait for onRulebook?')
    }
    return state.rulebook
}

// export const commitTree = () => tree.commit()

// export const getBattleScene = () => {
//     const curType = tree.select('scene').select('type').get()
//     if (curType != 'battle') {
//         throw new Error(`tried to get battle scene when you\'re in ${curType}`)
//     }
//     tree.select('scene') as BattleScene
// }
export const getBattleScene = (): MyCursor<BattleScene> => {
    const sceneName = getTree().select('scene').get('name')
    if (sceneName !== 'battle') {
        throw new Error(`tried to get battle scene when you're in ${sceneName}`)
    }
    return getTree().select('scene') as MyCursor<BattleScene>
}
export const getScene = (): MyCursor<Scene> => getTree().select('scene')
export const getBattleSceneData = (): BattleScene => getBattleScene().get()
