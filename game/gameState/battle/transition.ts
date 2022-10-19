import type { BattleCursor } from 'shared'
import { TOTAL_ROOMS_PER_RUN } from 'shared'

import { vals } from 'shared/code'
import { checkWinner } from './round'
import { getNewCardOptions } from './getNewCardOptions'
import { calculateLoot, calculateChestProgress } from './loot'
import { calculateNewRunScore } from './score'

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
            scene
                .select('runScore')
                .set('totalScore', calculateNewRunScore(scene))
            scene.set('state', 'won')
            // scene.set('endScreenHasOpened', true)
        } else {
            scene.set('state', 'collecting loot')
            scene.set('lootEarned', calculateLoot(scene, 'room'))
            scene.set('newCardOptions', getNewCardOptions(scene.get()))
            calculateNewRunScore(scene)
            calculateChestProgress(scene)
        }

        return true
    } else if (winner === 'NPC') {
        scene.select('runScore').set('totalScore', calculateNewRunScore(scene))
        scene.set('state', 'lost')
        return true
    }
    return false
}
