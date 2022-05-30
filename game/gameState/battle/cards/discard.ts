import produce from 'immer'
import type { Card, CardUid, BattleCursor } from 'shared'

export function discard(args: {
    cardUid: CardUid
    card: Card
    scene: BattleCursor
}): void {
    args.scene.apply(
        'cards',
        produce(cards => {
            const card = cards.hand[args.cardUid]
            delete cards.hand[args.cardUid]
            if (card) {
                cards.discard[args.cardUid] = card
            }
        })
    )
}
