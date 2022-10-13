import type { BattleCursor } from 'shared'

import { setAllCharactersToUnmoved } from './setAllCharactersToUnmoved'

export function endRound(scene: BattleCursor) {
    scene.apply('turnCount', c => c + 1)
    scene.set('isPlayerTurn', false)

    // applyDOTDamages(scene)
    setAllCharactersToUnmoved(scene)
    discardAllCards(scene)
}

function discardAllCards(scene: BattleCursor) {
    scene.apply('cards', cards => {
        const newCards = { ...cards }

        newCards.discard = { ...newCards.discard, ...newCards.hand }

        newCards.hand = {}

        return newCards
    })
}
