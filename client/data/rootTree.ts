import { getClientEnv } from '@/util/getClientEnv'
import type { ROBaobab, ROCursor } from 'sbaobab'
import { SBaobab } from 'sbaobab'
import type {
    BattleScene,
    EntryScene,
    GameState,
    OwnedCharacterStats,
    PlayerCharacterId,
    Scene,
} from 'shared'

/** Global variables for file */
const state = {
    gamestate: null as ROBaobab<GameState> | null,
}

let callbackWhenTreeInitialized: () => void
let onTreeInitialized = new Promise(
    resolve => (callbackWhenTreeInitialized = resolve as () => void)
)

export function initializeBaobabTree(gamestate: GameState): void {
    state.gamestate = new SBaobab(gamestate)
    if (getClientEnv('IS_PRODUCTION') === 'false')
        // @ts-expect-error
        window.tree = state.gamestate // no global tree for prod
    callbackWhenTreeInitialized()
}

export function getPromiseForTreeInitialized() {
    return onTreeInitialized
}

export function isTreeInitialized(): boolean {
    return state.gamestate != null
}

/** Do not call at the module-level
 * The pattern above with triggercallbacks etc lets us
 *  write synchronous code everywhere in app, we just need to
 *  wait for callbacks in onRulebook and onGamestate
 */
export function getTree(): ROBaobab<GameState> {
    if (state.gamestate == null) {
        throw Error(
            'tried to get tree before it was loaded. Did you wait for onGamestate?'
        )
    }
    return state.gamestate
}

export const getBattleScene = (): ROCursor<BattleScene> => {
    const sceneName = getTree().select('scene').get('id')
    if (sceneName !== 'battle') {
        throw new Error(`tried to get battle scene when you're in ${sceneName}`)
    }
    return getTree().select('scene') as ROCursor<BattleScene>
}
export const getEntryScene = (): ROCursor<EntryScene> => {
    const curType = getTree().select('scene').select('id').get()
    const selectionIds = ['entry', 'worlds', 'pvp'] as const
    if (!selectionIds.includes(curType as any)) {
        throw new Error(`tried to get entry scene when you're in ${curType}`)
    }
    return getTree().select('scene') as ROCursor<EntryScene>
}

export const getOwnedCharacters = (): ROCursor<
    Record<PlayerCharacterId, OwnedCharacterStats>
> => getTree().select('ownedCharacters')
export const getScene = (): ROCursor<Scene> => getTree().select('scene')
