import type { Card, BattleCursor, GameActions } from 'shared'

import { throwNull } from 'shared/code'
import { getBattleSceneIn } from '@/util'
import { updateCharacters } from '@/gameState/battle/characters/updateCharacters'
import { trackMetric } from 'server/metrics'
import { omit, merge } from 'lodash'
import produce from 'immer'
import { interpretCommand } from '@/gameState'
import { getTargetUids } from '@/gameState/battle/cards/getTargetUids'

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

    if (
        args.cardUids.filter(uid => !!scene.get('cards', 'hand', uid)).length <
        args.cardUids.length
    ) {
        logger.warn("some of these card uids aren't in the hand..")
        return
    }

    const cards = args.cardUids.map(uid => scene.get('cards', 'hand', uid))

    cards.forEach(card => {
        activeOnDiscardActions(card, scene)
    })
    /*
    // includes remove card from hand, add to discard, and activateOnDiscardActions
    scene.apply(
        'cards',
        produce(cards => {
            for (const uid of args.cardUids) {
                const card = cards.hand[uid]
                if (card == null) {
                    throw Error('card not in hand: ' + uid)
                }
                delete cards.hand[uid]
                cards.discard[uid] = card
                activeOnDiscardActions(card, scene)
            }
        })
    )
    */

    scene.select('cards', 'hand').apply(hand => {
        return omit(hand, ...args.cardUids)
    })

    const cardsMap = cards.reduce((o, k) => ({ ...o, [k.uid]: k }), {})
    scene.select('cards', 'discard').merge(cardsMap)

    scene.set('numRequiredToDiscard', 0)
}

export function activeOnDiscardActions(card: Card, scene: BattleCursor) {
    if (!card.on?.discard) return

    interpretCommand({
        command: {
            characterUid: card.characterUid,

            id: card.id,
            name: card.name,
            actions: card.on.discard,
            targetNum: card.targetNum,
            targetType: card.targetType,
        },
        targetUids: getTargetUids({
            card,
            targetUids: [],
            scene,
        }),
        scene,
    })
}
