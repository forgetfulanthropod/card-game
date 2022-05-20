import { omit } from 'lodash'
import type { Card, CardUid, BattleCursor } from 'shared'

export function discard(args: {
    cardUid: CardUid
    card: Card
    scene: BattleCursor
}): void {
    args.scene.apply('cards', cards => {
        const draw = cards.draw
        const hand = omit(cards.hand, args.cardUid)
        const discard = { ...cards.discard, ...{ [args.cardUid]: args.card } }

        // if (keys(hand).length === 0)
        //     ({ draw, hand, discard } = drawNewHand({
        //         drawPile: draw,
        //         hand,
        //         discardPile: discard,
        //     }))
        return { ...cards, draw, hand, discard }
    })
}
