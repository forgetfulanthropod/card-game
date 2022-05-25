import { memoize } from 'lodash'
import type { ROBaobab, ROCursor } from 'sbaobab'
import { SBaobab } from 'sbaobab'
import type {
    BattleScene,
    EntryScene,
    Gamestate,
    OwnedCharacterStats,
    Scene,
} from 'shared'

/** Global variables for file */
const state = {
    gamestate: null as ROBaobab<Gamestate> | null,
}

export function initializeBoababTree(gamestate: Gamestate): void {
    state.gamestate = new SBaobab(gamestate)
    // @ts-expect-error
    window.tree = state.gamestate
}

/** Do not call at the module-level
 * The pattern above with triggercallbacks etc lets us
 *  write synchronous code everywhere in app, we just need to
 *  wait for callbacks in onRulebook and onGamestate
 */
export function getTree(): ROBaobab<Gamestate> {
    if (state.gamestate == null) {
        throw Error(
            'tried to get tree before it was loaded. Did you wait for onGamestate?'
        )
    }
    return state.gamestate
}

export const getBattleScene = (): ROCursor<BattleScene> => {
    const sceneName = getTree().select('scene').get('name')
    if (sceneName !== 'battle') {
        throw new Error(`tried to get battle scene when you're in ${sceneName}`)
    }
    return getTree().select('scene') as ROCursor<BattleScene>
}
export const getEntryScene = (): ROCursor<EntryScene> => {
    const curType = getTree().select('scene').select('name').get()
    if (curType !== 'entry') {
        throw new Error(`tried to get entry scene when you're in ${curType}`)
    }
    return getTree().select('scene') as ROCursor<EntryScene>
}

export const getOwnedCharacters = (): ROCursor<
    Record<string, OwnedCharacterStats>
> => getTree().select('ownedCharacters')
export const getScene = (): ROCursor<Scene> => getTree().select('scene')

interface ClientTree {
    serverCalls: unknown[]
    // modal: null | { title: string, body: string, onClose: Callback }
}
/** TODO: merge with localTree */
export const getClientTree: () => SBaobab<ClientTree> = memoize(() => {
    return new SBaobab<ClientTree>({
        serverCalls: [],
        // modal: null,
    })
})

// @ts-ignore
window.clientTree = getClientTree()
