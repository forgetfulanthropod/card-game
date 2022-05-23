import type { Empty, InternalAction } from 'shared'

import {
    drawNewHand,
    clearBlock,
    clearHasMoved,
    setRoundEnergy,
    getNpcMoves,
} from '@/gameState'
import { getBattleSceneIn } from '@/util'

// const DEFAULT_WAIT = 1000
const DEBUG = false

export const resetRound: InternalAction['resetRound'] = (
    game: Gamecursor,
    _args: Empty
): undefined => {
    const scene = getBattleSceneIn(game)
    if (DEBUG) logger.info('resetting round')
    scene.select('nextEnemyCards').set(getNpcMoves(scene))

    setRoundEnergy(scene)
    clearHasMoved(scene)
    clearBlock(scene)
    scene.set('isPlayerTurn', true)
    drawNewHand(scene)
    return undefined
}
