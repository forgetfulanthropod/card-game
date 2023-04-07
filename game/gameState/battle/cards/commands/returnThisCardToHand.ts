import produce from 'immer'
import { BattleCursor, CardUid } from 'shared'
import type { Executors, Explainers } from './util'

export const explain: Explainers['returnThisCardToHand'] = dslArgs => {
    return 'return this card to your hand'
}

export const execute: Executors['returnThisCardToHand'] = ({
    scene,
    cardUid,
}) => {
    if (cardUid) bringCardToHand(scene, cardUid)
}

function bringCardToHand(scene: BattleCursor, cardUid: CardUid) {
    scene.apply(
        'cards',
        produce(cards => {
            let card = null
            if ((card = cards.draw[cardUid])) {
                delete cards.draw[cardUid]
            } else if ((card = cards.discard[cardUid])) {
                delete cards.discard[cardUid]
            }
            // if (!card) {
            //     logger.info(`the card hasn't been discarded.. ${cardUid}`)
            //     logger.info(
            //         cards.hand[cardUid] ? `it's in hand` : `it's not in hand`
            //     )
            // } else
            //     logger.info(
            //         `card is here putting it in hand, ${cardUid}, ${JSON.stringify(
            //             card
            //         )}`
            //     )

            if (card) cards.hand[cardUid] = card
        })
    )
}
