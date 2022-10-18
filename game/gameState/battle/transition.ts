import type { BattleCursor } from 'shared'
import { NUM_ROOMS_BEFORE_GAME_OVER } from 'shared'

import { vals } from 'shared/code'
import { checkWinner } from './round'
import { getNewCardOptions } from './getNewCardOptions'
import { calculateLoot, calculateChestProgress } from './loot'
import { calculateNewRunScore } from './score'
import { setAllCharactersToUnmoved } from './setAllCharactersToUnmoved'
import { resetStances } from './resetStances'
import { clearAllEffects } from './effects'
import { clearRoomCardModifiers, putAllCardsInDrawPile } from './cards'

export function maybeTransitionBattleState(scene: BattleCursor): boolean {
    const winner = checkWinner(vals(scene.get('allCharacters')))

    if (winner === 'PC') {
        // Add + 1 to check since the increment occur until later (eg. in nextRoom)
        const gameIsOver =
            scene.get('numRoomsPassed') + 1 >= NUM_ROOMS_BEFORE_GAME_OVER

        if (scene.get('numRoomsPassed') === NUM_ROOMS_BEFORE_GAME_OVER - 1) {
            scene.set('numRoomsPassed', scene.get('numRoomsPassed') + 1)
        }

        if (gameIsOver) {
            scene
                .select('runScore')
                .set('totalScore', calculateNewRunScore(scene))
            scene.set('state', 'won')
            scene.set('endScreenHasOpened', true)
        } else {
            setAllCharactersToUnmoved(scene)
            clearAllEffects(scene)
            resetStances(scene)
            clearRoomCardModifiers(scene)
            putAllCardsInDrawPile(scene)

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
