import produce from 'immer'
import { range, size } from 'lodash'
import { objShuffle } from 'shared/code'
import type { Executors, Explainers } from './util'
import { evalAll } from './util'

export const explain: Explainers['draw'] = dslArgs => {
    const [numCards] = evalAll(dslArgs)
    return `draw ${numCards} cards`
}

export const execute: Executors['draw'] = ({ dslArgs, scene }) => {
    const [numCards] = evalAll(dslArgs)
    scene.apply(
        'cards',
        produce(cards => {
            for (const _ of range(numCards)) {
                if (size(cards.draw) === 0) {
                    if (size(cards.discard) === 0) return
                    cards.draw = objShuffle(cards.discard)
                    cards.discard = {}
                }
                const uid = Object.keys(cards.draw)[0]
                cards.hand[uid] = cards.draw[uid]
                delete cards.draw[uid]
            }
        })
    )
}
