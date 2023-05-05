import { produce, current } from 'immer'
import { Card } from 'shared'

import { evalAll, Executors, Explainers } from './util'
import { activateTalents } from '../../Talents'
import { updateHand } from '../cardManagement'

export const explain: Explainers['brittle'] = dslArgs => {
    const [count] = evalAll(dslArgs)
    return '<b>Brittle</b>' + (count ? ` (${count})` : '')
}

export const execute: Executors['brittle'] = ({ dslArgs, cardUid, scene }) => {
    const [count] = evalAll(dslArgs)

    if (cardUid == null) throw Error('brittle did not receive a cardUid')

    // TODO: count
    let cardOut = null
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
                    /brittle(.+)/,
                    `brittle(${count - 1})`
                )
            } else {
                delete piles.hand[cardUid]
                delete piles.discard[cardUid]
                delete piles.draw[cardUid]
                piles.removedRun[cardUid] = card
                cardOut = current(card)
            }
            return piles
        })
    )
    if (cardOut)
        activateTalents({
            scene,
            key: 'brittleBreak',
            extra: { card: cardOut },
        })
    updateHand(scene)
}
