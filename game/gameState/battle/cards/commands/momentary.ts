import produce from 'immer'

import type { ExecuteArgs } from './util'

export function explain() {
    return `Removed until end of room`
}

export function execute({ scene, cardUid }: ExecuteArgs) {
    if (cardUid == null) throw Error('momentary did not receive a cardUid')
    scene.apply(
        'cards',
        produce(piles => {
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
