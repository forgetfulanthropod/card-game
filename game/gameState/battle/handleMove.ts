import type { BattleCursor } from 'shared'

import { vals } from 'shared/code'
import { checkWinner } from './round'

// function sort(array) {array[2] = 1} // error
// function sort(mut array)

export function checkBattleOverMut(scene: BattleCursor): boolean {
    const winner = checkWinner(vals(scene.get('allCharacters')))

    if (winner === 'PC') {
        scene.set('state', 'won')
        // incrementXP(scene)
        // putUpDoors(scene)
        return true
    } else if (winner === 'NPC') {
        scene.set('state', 'lost')
        return true
    }
    return false
}
