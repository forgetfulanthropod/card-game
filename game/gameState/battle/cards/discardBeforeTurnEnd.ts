import produce from 'immer'
import type { CardUid, BattleCursor, Card } from 'shared'
import { getTargetUids } from './getTargetUids'
import { interpretCommand } from './interpretCommand'
import { trackMetric } from 'server/metrics'

export function discardBeforeTurnEnd({
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
    // TODO: check if this logic is okay for
    // OnDiscardActions after discard
    const discard = scene.get('cards', 'discard')

    for (const uid of cardUids) {
        activeOnDiscardActions(discard[uid], scene)
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
