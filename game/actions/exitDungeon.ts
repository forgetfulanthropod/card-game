import type { GameActions } from '@serverActions'

import { initialEntryState } from '@/gameState/entry/state'

export const exitDungeon: GameActions['ExitDungeon'] = args => {
    if (args.game.select('scene').get('name') !== 'battle') {
        throw Error('exitDungeon callede when not in a battle scene')
    }
    args.game.select('scene').set(initialEntryState)
}
