import type { BattleCursor } from 'shared'
import { NUM_ROOMS_BEFORE_GAME_OVER } from 'shared'

import { vals } from 'shared/code'
import { checkWinner } from './round'
import { getNewCardOptions } from './getNewCardOptions'
import { calculateLoot, calculateChestProgress } from './loot'
import { calculateNewRunScore } from './score'

export function maybeTransitionBattleState(scene: BattleCursor): boolean {
    const winner = checkWinner(vals(scene.get('allCharacters')))

    if (winner === 'PC') {
        // Add + 1 to check since the increment occur until later (eg. in nextRoom)
        const gameIsOver =
            scene.get('numRoomsPassed') + 1 >= NUM_ROOMS_BEFORE_GAME_OVER

        scene.set('numRoomsPassed', scene.get('numRoomsPassed') + 1)

        if (gameIsOver) {
            scene
                .select('runScore')
                .set('totalScore', calculateNewRunScore(scene))
            scene.set('state', 'won')
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
