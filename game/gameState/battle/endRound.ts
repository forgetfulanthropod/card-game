import type { BattleCursor } from 'shared'
import { keys } from 'shared/code'

import { setAllCharactersToUnmoved } from './setAllCharactersToUnmoved'

export function endRound(scene: BattleCursor) {
    scene.apply('turnCount', c => c + 1)
    scene.set('isPlayerTurn', false)

    // applyDOTDamages(scene)
    scene.set('cardsPlayedThisTurn', [])
    trackStanceChanges(scene)
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

export function trackStanceChanges(scene: BattleCursor) {
    const allChars = scene.get('allCharacters')
    const newChars = { ...allChars }

    keys(newChars).forEach(uid => {
        if (!allChars[uid].isPc) return
        const stanceInPrevTurn = newChars[uid].stanceInPrevTurn
        const newStance = newChars[uid].stance

        if (newStance !== stanceInPrevTurn) {
            scene.apply('stanceChangesThisRoom', changes => {
                return [...changes, { newStance, targetUid: uid }]
            })
        }

        newChars[uid] = {
            ...newChars[uid],
            stanceInPrevTurn: newStance,
        }
    })

    scene.set('allCharacters', newChars)
    return newChars
}
