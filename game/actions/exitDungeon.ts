import type { GameActions } from './types'

import { initialEntryState } from '@/gameState'

export const exitDungeon: GameActions['ExitDungeon'] = args => {
    if (args.game.select('scene').get('name') !== 'battle') {
        throw Error('exitDungeon callede when not in a battle scene')
    }
    args.game.select('scene').set(initialEntryState)
}
