import produce from 'immer'
import type { CardUid, BattleCursor, Card } from 'shared'
import { getTargetUids } from './getTargetUids'
import { interpretCommand } from './interpretCommand'

export function discardBeforeTurnEnd({
    cardUids,
    scene,
}: {
    cardUids: CardUid[]
    scene: BattleCursor
}): void {
    const hand = scene.get('cards', 'hand')

    for (const uid of cardUids) {
        activeOnDiscardActions(hand[uid], scene)
    }

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

export function activeOnDiscardActions(card: Card, scene: BattleCursor) {
    if (!card.on?.discard) return

    interpretCommand({
        command: {
            characterUid: card.characterUid,

            id: card.id,
            name: card.name,
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
