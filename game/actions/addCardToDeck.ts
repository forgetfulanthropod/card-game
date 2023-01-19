import type { GameActions } from 'shared'
import { getBattleSceneIn } from '@/util'
import { addCardToDeckMetric } from '@/metrics'

export const addCardToDeck: GameActions['addCardToDeck'] = args => {
    const scene = getBattleSceneIn(args.game)

    const card = scene.get('newCardOptions', args.cardUid)

    if (card == null) throw new Error("that card uid isn't an option..")

    addCardToDeckMetric(card, scene.get('runId') || 0, args.username)

    scene.apply('cards', cards => {
        return {
            ...cards,
            draw: {
                ...cards.draw,
                [args.cardUid]: card,
            },
        }
    })

    scene.set('lootEarned', scene.get('lootEarned').slice(1))
    if (scene.get('lootEarned').length > 0) {
        scene.set('state', 'collecting loot')
    } else {
        scene.set('isInMap', true)
    }
}
