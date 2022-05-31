import produce from 'immer'

import type { Executors, Explainers } from './util'

export const explain: Explainers['momentary'] = _dslArgs => {
    return `Removed until end of room`
}

export const execute: Executors['momentary'] = ({ scene, cardUid }) => {
    if (cardUid == null) throw Error('momentary did not receive a cardUid')
    scene.apply(
        'cards',
        produce(piles => {
            // card should be in hand but better safe than sorry
            const card =
                piles.hand[cardUid] ??
                piles.discard[cardUid] ??
                piles.draw[cardUid]
            if (card == null)
                throw Error(`card '${cardUid}' had momentary but was not found`)
            delete piles.hand[cardUid]
            delete piles.discard[cardUid]
            delete piles.draw[cardUid]
            piles.removedRoom[cardUid] = card
        })
    )
}
