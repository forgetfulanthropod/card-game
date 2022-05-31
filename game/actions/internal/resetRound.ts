import type { Empty, InternalAction } from 'shared'

import {
    drawNewHand,
    clearBlock,
    clearHasMoved,
    setRoundEnergy,
    getNpcMoves,
    decrementEffects,
    applyTurnStartEffects,
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
    scene.select('nextNpcCommands').set(getNpcMoves(scene))

    setRoundEnergy(scene)
    clearHasMoved(scene)
    clearBlock(scene)
    decrementEffects(scene, 'npc')
    scene.set('isPlayerTurn', true)
    applyTurnStartEffects(scene, 'pc')
    drawNewHand(scene)

    return undefined
}
