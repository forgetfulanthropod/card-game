import type { BattleCursor } from 'shared'

import { keys } from 'shared/code'

export function endRound(scene: BattleCursor) {
    scene.apply('turnCount', c => c + 1)
    scene.set('isPlayerTurn', false)
    // applyDOTDamages(scene)
    setAllCharactersToUnmoved(scene)
    discardAllCards(scene)
}

function setAllCharactersToUnmoved(scene: BattleCursor) {
    scene.apply('allCharacters', ac => {
        const newAc = { ...ac }
        keys(newAc).forEach(k => {
            newAc[k] = { ...newAc[k], hasMoved: false }
        })
        return newAc
    })
}

function discardAllCards(scene: BattleCursor) {
    scene.apply('cards', cards => {
        const newCards = { ...cards }

        newCards.discard = { ...newCards.discard, ...newCards.hand }

        newCards.hand = {}

        return newCards
    })
}
