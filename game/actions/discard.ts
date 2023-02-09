import type { GameActions } from 'shared'

import { getBattleSceneIn } from '@/util'
import { discardBeforeTurnEnd } from '@/gameState/battle/cards/discardBeforeTurnEnd'

export const discard: GameActions['discard'] = args => {
    const scene = getBattleSceneIn(args.game)

    const numRequiredToDiscard = scene.get('numRequiredToDiscard')

    if (numRequiredToDiscard <= 0) {
        logger.warn('tried to discard in wrong gamestate')
        return
    }

    if (numRequiredToDiscard !== args.cardUids.length) {
        logger.warn(
            `expected ${numRequiredToDiscard} card uids, but got ${args.cardUids.length}`
        )
        return
    }

    discardBeforeTurnEnd({ cardUids: args.cardUids, scene })

    scene.set('numRequiredToDiscard', 0)
}
