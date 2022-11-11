import type { BattleCursor } from 'shared'

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
    const gameIsOver = !!scene.get('currentRoom').enemies.find(e => e.boss)

    if (winner) {
        checkServerScoringEvent('STANCE_CHANGES', scene, {})
        calculateNewRunScore(scene)
        calculateChestProgress(scene)
    }

    if (winner === 'PC') {
        if (gameIsOver) {
            scene.set('state', 'won')
            scene.set('numRoomsPassed', scene.get('numRoomsPassed') + 1)
            checkServerScoringEvent('RUN_COMPLETED', scene, {})
        } else {
            resetStances(scene)
            putAllCardsInDrawPile(scene)
            setAllCharactersToUnmoved(scene)
            clearAllEffects(scene)
            clearRoomCardModifiers(scene)

            scene.set('state', 'collecting loot')
            scene.set('lootEarned', calculateLoot(scene, 'room'))
            scene.set('newCardOptions', getNewCardOptions(scene.get()))
        }
        return true
    } else if (winner === 'NPC') {
        scene.set('state', 'lost')
        return true
    }
    return false
}
