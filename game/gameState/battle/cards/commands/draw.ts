import produce from 'immer'
import { range, size } from 'lodash'
import { BattleCursor } from 'shared'
import { objShuffle } from 'shared/code'
import type { Executors, Explainers } from './util'
import { evalAllAsHtml, evalAll } from './util'

export const explain: Explainers['draw'] = dslArgs => {
    const [numCards] = evalAllAsHtml(dslArgs)
    return `Draw ${numCards}`
}

export const execute: Executors['draw'] = ({ dslArgs, scene }) => {
    const [numCards] = evalAll(dslArgs)
    draw(scene, numCards)
}

export function draw(scene: BattleCursor, numCards: number) {
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
