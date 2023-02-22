import type { BattleCursor } from 'shared'

import { vals } from 'shared/code'
import { checkWinner } from './checkWinner'

import { calculateLoot, calculateChestProgress } from './loot'
import { calculateNewRunScore } from './score'
import { clearRoomCardModifiers, putAllCardsInDrawPile } from './cards'
import { checkServerScoringEvent } from './score/checkServerScoringEvent'
import { clearCharacterModifiersForRoom } from './characters/clearCharacterModifiersForRoom'
import { getNewCardOptions } from './cards/getNewCardOptions'
import { activateSouvenir, activateSouvenirs } from './activateSouvenirs'

export function maybeTransitionBattleState(scene: BattleCursor): boolean {
    const winner = checkWinner(vals(scene.get('allCharacters')))
    const gameIsOver = !!scene.get('currentRoom').enemies.find(e => e.boss)

    if (winner) {
        checkServerScoringEvent('CARDS_OVER_THRESHOLD', scene)
        checkServerScoringEvent('CARDS_WHOLE_PARTY', scene)
        calculateNewRunScore(scene)
        calculateChestProgress(scene)
        scene.set('numRequiredToDiscard', 0)
    }

    if (winner === 'PC') {
        checkServerScoringEvent('ROOM_CLEARED', scene)
        if (gameIsOver) {
            scene.set('numRoomsPassed', scene.get('numRoomsPassed') + 1)
            checkServerScoringEvent('RUN_COMPLETED', scene)
            scene.set('state', 'won')
            scene.select('runDuration').set('endTime', new Date().getTime())
        } else {
            activateSouvenirs('battleEnd', scene)
            clearCharacterModifiersForRoom(scene)
            clearRoomCardModifiers(scene)
            scene.set('state', 'collecting loot')
            scene.set('lootEarned', calculateLoot(scene, 'room'))
            scene.set('newCardOptions', getNewCardOptions(scene.get()))
        }
        return true
    } else if (winner === 'NPC') {
        checkServerScoringEvent('RUN_DEFEATED', scene)
        scene.set('state', 'lost')
        return true
    }
    return false
}
