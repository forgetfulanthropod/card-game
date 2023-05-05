import { produce, current } from 'immer'

import type { Card } from 'shared'

import type { Executors, Explainers } from './util'
import { activateTalentsData } from '../../Talents'

export const explain: Explainers['momentary'] = _dslArgs => {
    return `<b>Momentary</b>`
}

export const execute: Executors['momentary'] = ({ scene, cardUid }) => {
    if (cardUid == null) throw Error('momentary did not receive a cardUid')
    let oldCard = null
    scene.select('cards').apply(
        produce(piles => {
            // card should be in hand but better safe than sorry
            const card =
                piles.hand[cardUid] ??
                piles.discard[cardUid] ??
                piles.draw[cardUid]
            oldCard = current(card)
            if (card == null)
                throw Error(`card '${cardUid}' had momentary but was not found`)
            let interrupt = false
            if (!scene.get('isSimulation'))
                interrupt = activateTalentsData({
                    scene,
                    key: 'momentaryInterrupt',
                    data: interrupt,
                    extra: { card: current(card) },
                })
            if (!interrupt) {
                delete piles.hand[cardUid]
                delete piles.discard[cardUid]
                delete piles.draw[cardUid]
                piles.removedRoom[cardUid] = card
            }
            return piles
        })
    )
    let interrupt = false
    if (!scene.get('isSimulation') && oldCard)
        interrupt = activateTalentsData({
            scene,
            key: 'momentaryAfter',
            data: interrupt,
            extra: { card: oldCard },
        })
}
