import type { BattleCursor, Card, CardUid, GameActions } from 'shared'
import { getBattleSceneIn } from '@/util'
import { trackMetric } from 'server/metrics'
import { checkServerScoringEvent } from '@/gameState/battle/score'

export const addCardToDeck: GameActions['addCardToDeck'] = args => {
    const scene = getBattleSceneIn(args.game)

    const card = scene.get('newCardOptions', args.cardUid)

    if (card == null) throw new Error("that card uid isn't an option..")

    trackMetric('addCardToDeck', { card, scene })

    addCardToDeckPostValidation(scene, { ...card, uid: args.cardUid })

    checkServerScoringEvent('CARDS_DRAFT_BALANCED', scene)

    scene.set('lootEarned', scene.get('lootEarned').slice(1))
    if (scene.get('lootEarned').length > 0) {
        scene.set('state', 'collecting loot')
    } else {
        scene.set('state', 'map')
        scene.set('isInMap', true)
    }
}

export function addCardToDeckPostValidation(scene: BattleCursor, card: Card) {
    scene.apply('cards', cards => {
        return {
            ...cards,
            draw: {
                ...cards.draw,
                [card.uid]: card,
            },
        }
    })

    scene.apply('cardsDrafted', cards => [...cards, card])
}
