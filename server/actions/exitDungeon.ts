import { initialEntryState } from '@/gameState/entry/state'
import { getGameStateCursor } from '@/util'
import type { ExitDungeon } from '@shared'
export const exitDungeon: ExitDungeon = (args) => {
    const gameState = getGameStateCursor('alice')
    if (gameState.select('scene').getK('name') !== 'battle') {
        throw Error('exitDungeon callede when not in a battle scene')
    }
    gameState.select('scene').set(initialEntryState)
    gameState.commit()
}
