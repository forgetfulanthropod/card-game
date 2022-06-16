import type { GameActions } from 'shared'
import { nextRoom } from './nextRoom'
import { getBattleSceneIn } from '@/util'

export const addCardToDeck: GameActions['addCardToDeck'] = args => {
    const scene = getBattleSceneIn(args.game)

    const card = scene.get('newCardOptions', args.cardUid)

    if (card == null) throw new Error("that card uid isn't an option..")

    scene.apply('cards', cards => {
        return {
            ...cards,
            draw: {
                ...cards.draw,
                [args.cardUid]: card,
            },
        }
    })

    nextRoom(args)
}
