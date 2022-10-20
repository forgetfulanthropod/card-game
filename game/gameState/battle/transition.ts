import type { BattleCursor } from 'shared'
import { TOTAL_ROOMS_PER_RUN } from 'shared'

import { vals } from 'shared/code'
import { checkWinner } from './round'
import { getNewCardOptions } from './getNewCardOptions'
import { calculateLoot, calculateChestProgress } from './loot'
import { calculateNewRunScore } from './score'
import { checkServerScoringEvent } from './score/checkServerScoringEvent'

export function maybeTransitionBattleState(scene: BattleCursor): boolean {
    const winner = checkWinner(vals(scene.get('allCharacters')))

    if (winner === 'PC') {
        const gameIsOver =
        scene.get('numRoomsPassed') + 1 >= TOTAL_ROOMS_PER_RUN

        if (scene.get('numRoomsPassed') === TOTAL_ROOMS_PER_RUN - 1) {
            // Handles the very last room (since nextRoom will never be called from there)
            scene.set('numRoomsPassed', scene.get('numRoomsPassed') + 1)
        }

        if (gameIsOver) {
            scene.set('state', 'won')
            checkServerScoringEvent('minsUnderRunThreshold', scene, {})
        } else {
            scene.set('state', 'collecting loot')
            scene.set('lootEarned', calculateLoot(scene, 'room'))
            scene.set('newCardOptions', getNewCardOptions(scene.get()))
        }

        calculateChestProgress(scene)
        calculateNewRunScore(scene)
        return true
    } else if (winner === 'NPC') {
        calculateNewRunScore(scene)
        scene.set('state', 'lost')
        return true
    }
    return false
}
