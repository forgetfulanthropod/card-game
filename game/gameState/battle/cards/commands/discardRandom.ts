import produce from 'immer'
import { shuffle } from 'lodash'
import { discardBeforeTurnEnd } from '../discardUtil'
import type { Executors, Explainers } from './util'
import { evalAll, evalAllAsHtml } from './util'

export const explain: Explainers['discardRandom'] = dslArgs => {
    const [numCards] = evalAllAsHtml(dslArgs)
    return `Discard ${numCards} card${
        Number(numCards) > 1 ? 's' : ''
    } at random.`
}

export const execute: Executors['discardRandom'] = ({ dslArgs, scene }) => {
    const [numCards] = evalAll(dslArgs)
    // TODO shuffle should be part of random seed
    const cardUids = shuffle(Object.keys(scene.get('cards', 'hand')))
    const numDiscard = Math.min(numCards, cardUids.length)
    const cardsDiscard = cardUids.slice(0, numDiscard)
    discardBeforeTurnEnd({
        cardUids: cardsDiscard,
        scene,
    })
}
