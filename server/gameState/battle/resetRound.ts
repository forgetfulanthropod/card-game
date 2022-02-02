import type { BattleCursor } from '@/util'

import { drawNewHand } from './cards/drawNewHand'
import { clearBlock } from './clearBlock'
import { clearHasMoved } from './clearHasMoved'
import { setRoundEnergy } from './energy/getRoundEnergy'
import { tl } from './logging'

// const DEFAULT_WAIT = 1000
const DEBUG = false

export function resetRound(scene: BattleCursor): void {
    if (DEBUG) tl('resetting moves')

    setRoundEnergy(scene)
    clearHasMoved(scene)
    clearBlock(scene)
    scene.set('isPlayerTurn', true)
    drawNewHand(scene)

    // const playerStartsRound = getRulebook().shouldCoinFlipEveryRound
    //     ? scene.select('playerStarts').get()
    //     : srandom() < 0.5
    // scene.set('isPlayerTurn', playerStartsRound)
    // tl(playerStartsRound ? 'You start' : 'Enemy starts')
    // if (!playerStartsRound) {
    //     await sleep(DEFAULT_WAIT)
    //     await doNpcMove('first move of round', scene)
    // }
}
