import type { BattleCursor } from 'shared'

import { vals } from 'shared/code'
import { checkWinner } from './round'

// function sort(array) {array[2] = 1} // error
// function sort(mut array)

const MAX_ROOMS = 5
export function maybeTransitionBattleState(scene: BattleCursor): boolean {
    const winner = checkWinner(vals(scene.get('allCharacters')))

    if (winner === 'PC') {
        if (scene.get('roomsPassed') < MAX_ROOMS) {
            scene.set('state', 'choosing cards')
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
