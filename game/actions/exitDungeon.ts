import type { GameActions } from 'shared'

import { initialEntryState } from '@/gameState'

export const exitDungeon: GameActions['exitDungeon'] = args => {
    if (args.game.select('scene').get('name') !== 'battle') {
        throw Error('exitDungeon callede when not in a battle scene')
    }
    args.game.select('scene').set(initialEntryState)
}
