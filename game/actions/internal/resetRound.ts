import type { Empty, InternalAction } from 'shared'

import { drawNewHand } from '@/gameState/battle/cards/drawNewHand'
import { clearBlock } from '@/gameState/battle/clearBlock'
import { clearHasMoved } from '@/gameState/battle/clearHasMoved'
import { setRoundEnergy } from '@/gameState/battle/energy/getRoundEnergy'
import { tl } from '@/gameState/battle/logging'
import { getBattleSceneIn } from '@/util'

// const DEFAULT_WAIT = 1000
const DEBUG = false

export const resetRound: InternalAction['resetRound'] = (
    game: Gamecursor,
    _args: Empty
): undefined => {
    const scene = getBattleSceneIn(game)
    if (DEBUG) tl('resetting round')

    setRoundEnergy(scene)
    clearHasMoved(scene)
    clearBlock(scene)
    scene.set('isPlayerTurn', true)
    drawNewHand(scene)
    return undefined
}
