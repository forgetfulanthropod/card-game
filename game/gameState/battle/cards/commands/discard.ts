import { activeOnDiscardActions } from '@/actions/discard'
import produce from 'immer'
import { shuffle } from 'lodash'
import { keys, vals } from 'shared/code'
import { discardAllCards } from '../discardAllCards'
import type { Executors, Explainers } from './util'
import { evalAll, evalAllAsHtml } from './util'

export const explain: Explainers['discard'] = dslArgs => {
    const [numCards] = evalAllAsHtml(dslArgs)
    return `Discard ${numCards}`
}

export const execute: Executors['discard'] = ({ dslArgs, scene }) => {
    const [numCards] = evalAll(dslArgs)

    logger.info('hand: ' + keys(scene.get('cards', 'hand')))

    const handHasMoreCardsThanThis =
        keys(scene.get('cards', 'hand')).length > numCards

    if (numCards > 0 && handHasMoreCardsThanThis)
        scene.set('numRequiredToDiscard', numCards)
    else {
        vals(scene.get('cards', 'hand')).forEach(card => {
            activeOnDiscardActions(card, scene)
        })
        discardAllCards(scene)
    }

    // scene.select('cards').apply(
    //     produce(cards => {
    //         const uids = shuffle(Object.keys(cards.hand))
    //         const n = Math.min(numCards, uids.length)
    //         for (let i = 0; i < n; i++) {
    //             const uid = uids[i]
    //             cards.discard[uid] = cards.hand[uid]
    //             delete cards.hand[uid]
    //         }
    //     })
    // )
}
