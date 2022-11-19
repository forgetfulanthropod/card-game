import type { BattleCursor, Piles } from 'shared'
import { keys, vals } from 'shared/code'
import { getDeadPcs } from '../characters/characterGetters'

export function removeDeadCharacterCards(scene: BattleCursor) {
    getDeadPcs(scene.get()).forEach(({ uid }) => {
        scene.apply('cards', cards => {
            const newCards: Piles = {
                draw: {},
                hand: {},
                discard: {},
                removedRoom: {},
                removedRun: {},
            }

            keys(cards).forEach(pileId => {
                vals(cards[pileId]).forEach(card => {
                    if (card.characterUid === uid) {
                        newCards['removedRun'][card.uid] = card
                    } else {
                        newCards[pileId][card.uid] = card
                    }
                })
            })

            return newCards
        })
        // vals(cards.draw).forEach(card => )
    })
}
