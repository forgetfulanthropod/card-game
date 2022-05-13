import type { BattleCursor } from '@/util'
import { commit } from '@/util'

import { drawNewHand } from './cards/drawNewHand'
import { clearBlock } from './clearBlock'
import { clearHasMoved } from './clearHasMoved'
import { setRoundEnergy } from './energy/getRoundEnergy'
import { tl } from './logging'

// const DEFAULT_WAIT = 1000
const DEBUG = false

export function resetRound(scene: BattleCursor): void {
    if (DEBUG) tl('resetting round')

    setRoundEnergy(scene)
    clearHasMoved(scene)
    clearBlock(scene)
    scene.set('isPlayerTurn', true)
    drawNewHand(scene)
    commit(scene, scene.get('username'))
}
