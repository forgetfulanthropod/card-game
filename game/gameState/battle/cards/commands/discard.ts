import { vals } from 'shared/code'
import { discardBeforeTurnEnd } from '../discardUtil'
import type { Executors, Explainers } from './util'
import { evalAll, evalAllAsHtml } from './util'

export const explain: Explainers['discard'] = dslArgs => {
    const [numCards] = evalAllAsHtml(dslArgs)
    return `Discard ${numCards} card${Number(numCards) > 1 ? 's' : ''}`
}

export const execute: Executors['discard'] = ({ cardUid, dslArgs, scene }) => {
    const [numCards] = evalAll(dslArgs)

    const numCardsBefore = scene.get('numRequiredToDiscard')

    const remainingCardsInHand = vals(scene.get('cards', 'hand')).filter(
        card => card.uid !== cardUid
    )

    const handHasMoreCardsThanThis =
        remainingCardsInHand.length > numCards + numCardsBefore

    if (numCards > 0 && handHasMoreCardsThanThis)
        scene.set('numRequiredToDiscard', numCards + numCardsBefore)
    else {
        discardBeforeTurnEnd({
            cardUids: remainingCardsInHand.map(c => c.uid),
            scene,
        })
    }
}
