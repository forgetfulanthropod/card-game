import type { PlayCard } from '@serverActions'
import { omit } from 'lodash'

import { getBattleScene, keys, vals } from '@/util'

export const playCard: PlayCard = args => {
    // console.log('hello from playCard')
    const scene = getBattleScene(args.username)
    const cards = scene.get('cards')

    const cardIndex = keys(cards.hand).findIndex(
        cardUid => cardUid === args.cardUid
    )
    const card = vals(cards.hand)[cardIndex]

    if (card == null) throw new Error('card Uid not found, something is wrong')

    scene.apply('cards', cards => {
        const hand = omit(cards.hand, args.cardUid)
        const discard = { ...cards.discard, ...{ [args.cardUid]: card } }

        // console.log({ ...cards, hand, discard })

        scene.set('cards', cards)
        return { ...cards, hand, discard }
    })
    // commit(scene, args.username)
}
