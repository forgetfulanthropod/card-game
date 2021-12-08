import type { ExitDungeon } from '@serverActions'

import { initialEntryState } from '@/gameState/entry/state'
import { getGameStateCursor } from '@/util'

export const exitDungeon: ExitDungeon = args => {
    const gameState = getGameStateCursor(args.username)
    if (gameState.select('scene').get('name') !== 'battle') {
        throw Error('exitDungeon callede when not in a battle scene')
    }
    gameState.select('scene').set(initialEntryState)
}
