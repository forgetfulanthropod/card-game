import type { BattleCursor } from 'shared'
import { TOTAL_ROOMS_PER_RUN } from 'shared'

import { vals } from 'shared/code'
import { checkWinner } from './round'
import { getNewCardOptions } from './getNewCardOptions'
import { calculateLoot, calculateChestProgress } from './loot'
import { calculateNewRunScore } from './score'
import { setAllCharactersToUnmoved } from './setAllCharactersToUnmoved'
import { resetStances } from './resetStances'
import { clearAllEffects } from './effects'
import { clearRoomCardModifiers, putAllCardsInDrawPile } from './cards'
import { checkServerScoringEvent } from './score/checkServerScoringEvent'

export function maybeTransitionBattleState(scene: BattleCursor): boolean {
    const winner = checkWinner(vals(scene.get('allCharacters')))

    if (winner === 'PC') {
        const gameIsOver =
            scene.get('numRoomsPassed') + 1 >= TOTAL_ROOMS_PER_RUN

        if (gameIsOver) {
            scene.set('state', 'won')
            scene.set('numRoomsPassed', scene.get('numRoomsPassed') + 1)
            checkServerScoringEvent('RUN_COMPLETED', scene, {})
        } else {
            setAllCharactersToUnmoved(scene)
            clearAllEffects(scene)
            clearRoomCardModifiers(scene)
            putAllCardsInDrawPile(scene)

            scene.set('state', 'collecting loot')
            scene.set('lootEarned', calculateLoot(scene, 'room'))
            scene.set('newCardOptions', getNewCardOptions(scene.get()))
        }

        checkServerScoringEvent('STANCE_CHANGES', scene, {})
        calculateChestProgress(scene)
        calculateNewRunScore(scene)
        return true
    } else if (winner === 'NPC') {
        checkServerScoringEvent('STANCE_CHANGES', scene, {})
        calculateNewRunScore(scene)
        scene.set('state', 'lost')
        return true
    }
    return false
}
