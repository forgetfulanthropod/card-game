import type { BattleCursor } from 'shared'

import { vals } from 'shared/code'
import { checkWinner } from './checkWinner'

import { activateSouvenirs } from './activateSouvenirs'
import { clearRoomCardModifiers } from './cards'
import { getNewCardOptions } from './cards/getNewCardOptions'
import { clearCharacterModifiersForRoom } from './characters/clearCharacterModifiersForRoom'
import { clearCommandHooks } from './commandHookUtil'
import { calculateChestProgress, calculateLoot } from './loot'
import { calculateNewRunScore } from './score'
import { checkServerScoringEvent } from './score/checkServerScoringEvent'
import { activateTalents } from './Talents'

export function maybeTransitionBattleState(scene: BattleCursor): boolean {
    if (scene.get('state') !== 'in battle') return false

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
            clearCharacterModifiersForRoom(scene)
            clearRoomCardModifiers(scene)
            clearCommandHooks(scene)
            activateSouvenirs('battleEnd', scene)
            activateTalents({ scene, key: 'battleEnd' })
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
