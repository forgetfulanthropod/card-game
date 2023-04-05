import type { GameActions } from 'shared'
import { trackMetric } from 'server/metrics'

import { getBattleSceneIn } from '@/util'
import { discardBeforeTurnEnd } from '@/gameState/battle/cards/discardUtil'

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

    const hand = scene.get('cards', 'hand')
    args.cardUids.forEach(uid => {
        try {
            const card = hand[uid]
            trackMetric('discardCard', { card, scene })
        } catch (err) {
            const error = err as unknown as Error
            logger.error(`error tracking card discard aciton: ${error.message}`)
        }
    })
    discardBeforeTurnEnd({ cardUids: args.cardUids, scene })

    scene.set('numRequiredToDiscard', 0)
}
