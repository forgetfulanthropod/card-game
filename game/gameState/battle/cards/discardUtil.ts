import produce from 'immer'
import type { BattleCursor, Card, CardUid } from 'shared'
import { getTargetUids } from './getTargetUids'
import { interpretCommand } from './interpretCommand'

export function discardAllCards(scene: BattleCursor) {
    scene.apply('cards', cards => {
        const newCards = { ...cards }

        newCards.discard = { ...newCards.discard, ...newCards.hand }

        newCards.hand = {}

        return newCards
    })
}

export function discard({
    cardUids,
    scene,
}: {
    cardUids: CardUid[]
    scene: BattleCursor
}): void {
    scene.apply(
        'cards',
        produce(cards => {
            for (const uid of cardUids) {
                const card = cards.hand[uid]

                if (card == null) {
                    throw Error('card not in hand: ' + uid)
                }
                delete cards.hand[uid]
                cards.discard[uid] = card
            }
        })
    )
}

export function discardBeforeTurnEnd({
    cardUids,
    scene,
}: {
    cardUids: CardUid[]
    scene: BattleCursor
}): void {
    discard({ cardUids, scene })

    // TODO: check if this logic is okay for
    // OnDiscardActions after discard
    const discardPile = scene.get('cards', 'discard')

    for (const uid of cardUids) {
        activeOnDiscardActions(discardPile[uid], scene)
    }
}

export function activeOnDiscardActions(card: Card, scene: BattleCursor) {
    if (!card.on?.discard) return

    interpretCommand({
        command: {
            characterUid: card.characterUid,

            id: card.id,
            name: card.name,
            uid: card.uid,
            actions: card.on.discard,
            targetNum: card.targetNum,
            targetType: card.targetType,
        },
        targetUids: getTargetUids({
            card,
            targetUids: [],
            scene,
        }),
        scene,
    })
}
