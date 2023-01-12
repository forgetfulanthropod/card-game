import produce from 'immer'

import { evalAll, Executors, Explainers } from './util'

export const explain: Explainers['brittle'] = dslArgs => {
    const [count] = evalAll(dslArgs)
    return 'Brittle' + (count ? `(${count})` : '')
}

export const execute: Executors['brittle'] = ({ dslArgs, cardUid, scene }) => {
    const [count] = evalAll(dslArgs)

    if (cardUid == null) throw Error('brittle did not receive a cardUid')

    // TODO: count

    scene.apply(
        'cards',
        produce(piles => {
            // card should be in hand but better safe than sorry
            const card =
                piles.hand[cardUid] ??
                piles.discard[cardUid] ??
                piles.draw[cardUid]
            if (card == null)
                throw Error(`card '${cardUid}' had brittle but was not found`)

            if (count > 1) {
                card.actions = card.actions.replace(
                    /dwindle(.+)/,
                    `dwindle(${count - 1})`
                )
            } else {
                delete piles.hand[cardUid]
                delete piles.discard[cardUid]
                delete piles.draw[cardUid]
                piles.removedRoom[cardUid] = card
            }
        })
    )
}
