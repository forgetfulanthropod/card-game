import produce from 'immer'
import type { BattleCursor, Pile, Card, CardUid } from 'shared'
import { getTargetUids } from './getTargetUids'
import { interpretCommand } from './interpretCommand'
import { activateSouvenirs } from '../activateSouvenirs'
import { activateTalents, activateTalentsData } from '../Talents'
import { cardDefinitionsMap } from '@/rulebook'

export function discardAllCards(scene: BattleCursor) {
    let keep: CardUid[] = []
    keep = activateTalentsData({
        scene,
        key: 'preDiscardAtTurnEnd',
        data: keep,
        extra: { piles: scene.get('cards') },
    })

    scene.apply('cards', cards => {
        const newCards = { ...cards }
        newCards.discard = { ...newCards.discard, ...newCards.hand }
        newCards.hand = {}
        return newCards
    })

    putInHandFromDiscard(scene, keep)
}

export const putInHandFromDiscard = (
    scene: BattleCursor,
    selected: CardUid[]
) => {
    // TODO: improve implementation; maybe use produce
    scene.apply('cards', cards => {
        const newCards = { ...cards }
        selected.forEach(carduid => {
            try {
                newCards.hand = {
                    ...newCards.hand,
                    [carduid]: newCards.discard[carduid],
                }
                newCards.discard = Object.fromEntries(
                    Object.entries(newCards.discard).filter(
                        ([uid, card]) => uid != carduid
                    )
                )
            } catch (e) {
                logger.error(e)
            }
        })
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
        const card = discardPile[uid]
        activeOnDiscardActions(card, scene)
        activateTalents({ scene, key: 'discardCard', extra: { card } })
    }
    activateSouvenirs('discardEnd', scene)
    activateTalents({ scene, key: 'discardEnd' })
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
