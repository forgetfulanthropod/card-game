import produce from 'immer'
import type { BattleCursor, CharacterUid, Piles } from 'shared'
import { keys, vals } from 'shared/code'
import { getDeadPcs } from '../characters/characterGetters'

export function removeDeadCharacterCards(scene: BattleCursor) {
    scene.apply(
        'cards',
        produce(cards => {
            getDeadPcs(scene.get()).forEach(({ uid }) => {
                keys(cards).forEach(pileId => {
                    vals(cards[pileId]).forEach(card => {
                        if (card.characterUid === uid) {
                            cards.removedDead[card.uid] = card
                        }
                    })
                })
            })
        })
    )
}

export function restoreDeadCharacterCards(
    scene: BattleCursor,
    characterUid: CharacterUid
) {
    scene.apply(
        'cards',
        produce(cards => {
            vals(cards.removedDead).forEach(card => {
                if (card.characterUid === characterUid) {
                    cards.draw[card.uid] = card
                }
            })
        })
    )
}
