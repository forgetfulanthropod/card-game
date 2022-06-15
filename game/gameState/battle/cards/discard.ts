import produce from 'immer'
import type { CardUid, BattleCursor } from 'shared'

export function discard(args: {
    cardUids: CardUid[]
    scene: BattleCursor
}): void {
    args.scene.apply(
        'cards',
        produce(cards => {
            for (const uid of args.cardUids) {
                const card = cards.hand[uid]
                if (card == null) throw Error('card not in hand:' + uid)
                delete cards.hand[uid]
                cards.discard[uid] = card
            }
        })
    )
}
