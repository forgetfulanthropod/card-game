import type { ExitDungeon } from '@shared'

import { initialEntryState } from '@/gameState/entry/state'
import { commit, getGameStateCursor } from '@/util'

export const exitDungeon: ExitDungeon = () => {
    const gameState = getGameStateCursor('alice')
    if (gameState.select('scene').get('name') !== 'battle') {
        throw Error('exitDungeon callede when not in a battle scene')
    }
    gameState.select('scene').set(initialEntryState)
    commit(gameState)
}
