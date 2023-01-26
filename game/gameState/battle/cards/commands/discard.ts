import produce from 'immer'
import { shuffle } from 'lodash'
import type { Executors, Explainers } from './util'
import { evalAll, evalAllAsHtml } from './util'

export const explain: Explainers['discard'] = dslArgs => {
    const [numCards] = evalAllAsHtml(dslArgs)
    return `Discard ${numCards}`
}

export const execute: Executors['discard'] = ({ dslArgs, scene }) => {
    const [numCards] = evalAll(dslArgs)
    scene.select('cards').apply(
        produce(cards => {
            const uids = shuffle(Object.keys(cards.hand))
            const n = Math.min(numCards, uids.length)
            for (let i = 0; i < n; i++) {
                const uid = uids[i]
                cards.discard[uid] = cards.hand[uid]
                delete cards.hand[uid]
            }
        })
    )
}
