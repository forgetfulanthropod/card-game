import { produce } from 'immer'
import type { GameActions } from './types'
import { getBattleSceneIn } from '@/util'
import { discard } from '@/gameState'
export const finishCard: GameActions['FinishCard'] = ({ cardUids, game }) => {
    const scene = getBattleSceneIn(game)
    const ra = scene.get('requireAction')
    if (ra == null) throw Error('no action is required')
    if (cardUids.length < ra.least || cardUids.length > ra.most)
        throw Error('wrong number of cards')
    switch (ra.type) {
        case 'discard': {
            discard({ cardUids, scene })
            break
        }
        case 'removeFromRoom': {
            scene.apply(
                'cards',
                produce(cards => {
                    for (const uid of cardUids) {
                        const card = cards.hand[uid]
                        if (card == null) throw Error('card not in hand:' + uid)
                        delete cards.hand[uid]
                        cards.removedRoom[uid] = card
                    }
                })
            )
            break
        }
        case 'discardFromDraw': {
            scene.apply(
                'cards',
                produce(cards => {
                    for (const uid of cardUids) {
                        const card = cards.draw[uid]
                        if (card == null) throw Error('card not in draw:' + uid)
                        delete cards.draw[uid]
                        cards.discard[uid] = card
                    }
                })
            )
            break
        }
        default: {
            throw Error('unknown required action type:', ra.type)
        }
    }
    scene.set('requireAction', null)
}
