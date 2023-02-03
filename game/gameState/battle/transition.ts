import type { BattleCursor } from 'shared'

import { vals } from 'shared/code'
import { checkWinner } from './checkWinner'

import { calculateLoot, calculateChestProgress } from './loot'
import { calculateNewRunScore } from './score'
import { clearRoomCardModifiers, putAllCardsInDrawPile } from './cards'
import { checkServerScoringEvent } from './score/checkServerScoringEvent'
import { clearCharacterModifiersForRoom } from './characters/clearCharacterModifiersForRoom'
import { getNewCardOptions } from './cards/getNewCardOptions'

export function maybeTransitionBattleState(scene: BattleCursor): boolean {
    const winner = checkWinner(vals(scene.get('allCharacters')))
    const gameIsOver = !!scene.get('currentRoom').enemies.find(e => e.boss)

    if (winner) {
        checkServerScoringEvent('STANCE_CHANGES_OVER', scene, {})
        calculateNewRunScore(scene)
        calculateChestProgress(scene)
    }

    if (winner === 'PC') {
        if (gameIsOver) {
            checkServerScoringEvent('ROOM_CLEARED', scene, {})
            scene.set('numRoomsPassed', scene.get('numRoomsPassed') + 1)
            scene.set('state', 'won')
            scene.select('runDuration').set('endTime', new Date().getTime())
            checkServerScoringEvent('RUN_COMPLETED', scene, {})
        } else {
            clearCharacterModifiersForRoom(scene)

            clearRoomCardModifiers(scene)

            scene.set('state', 'collecting loot')
            checkServerScoringEvent('ROOM_CLEARED', scene, {})
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
