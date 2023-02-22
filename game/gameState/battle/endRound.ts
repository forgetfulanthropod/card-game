import type { BattleCursor } from 'shared'

import { setAllCharactersToUnmoved } from './characters/setAllCharactersToUnmoved'
import { trackStanceChanges } from './characters/trackStanceChanges'
import { discardAllCards } from './cards/discardAllCards'

export function endRound(scene: BattleCursor) {
    scene.set('isPlayerTurn', false)

    // applyDOTDamages(scene)
    scene.set('cardsPlayedThisTurn', [])
    trackStanceChanges(scene)
    setAllCharactersToUnmoved(scene)
    discardAllCards(scene)
}
