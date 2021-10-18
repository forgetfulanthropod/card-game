import type { BattleScene } from '@shared/battleTypes'
import type { EntryScene, Gamestate, MyCursor, Rulebook } from '@shared/index'
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

export async function fillBothTrees(): Promise<void> {
    state.gamestate = new MyBaobab(await getGameState())
    // @ts-ignore for debugging:
    window.tree = state.gamestate
    for (const cb of state.gameStateCallbacks) { cb() }
    state.gameStateCallbacks = []
    state.rulebook = await getRulebookAsync()
    for (const cb of state.rulebookCallbacks) { cb() }
    state.rulebookCallbacks = []
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

/** Do not call at the module-level */
export function getRulebook(): Rulebook {
    if (state.rulebook == null) {
        console.trace('tried to get rulebook before it was loaded. Did you wait for onRulebook?')
        throw Error()
    }
    return state.rulebook
}

// export const commitTree = () => tree.commit()

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

export const scene = getTree().select('scene')
export const ownedCharacters = getTree().select('ownedCharacters')
export const getScene = (): MyCursor<Scene> => getTree().select('scene')
export const getBattleSceneData = (): BattleScene => getBattleScene().get()
