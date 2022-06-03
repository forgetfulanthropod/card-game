import type { BattleCursor } from 'shared'

import { vals } from 'shared/code'
import { checkWinner } from './round'
import { getNewCardOptions } from './getNewCardOptions'

const NUM_ROOMS_BEFORE_GAME_OVER = 5

export function maybeTransitionBattleState(scene: BattleCursor): boolean {
    const winner = checkWinner(vals(scene.get('allCharacters')))

    if (winner === 'PC') {
        if (scene.get('numRoomsPassed') < NUM_ROOMS_BEFORE_GAME_OVER) {
            scene.set('state', 'choosing cards')
            scene.set('newCardOptions', getNewCardOptions(scene.get()))
        } else scene.set('state', 'won')
        // incrementXP(scene)
        // putUpDoors(scene)
        return true
    } else if (winner === 'NPC') {
        scene.set('state', 'lost')
        return true
    }
    return false
}
