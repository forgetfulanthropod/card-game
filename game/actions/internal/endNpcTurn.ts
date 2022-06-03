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

export const endNpcTurn: InternalAction['endNpcTurn'] = (
    game: Gamecursor,
    _args: Empty
): void => {
    const scene = getBattleSceneIn(game)
    if (DEBUG) logger.info('resetting round')
    scene.select('nextNpcCommands').set(getNpcMoves(scene))

    setRoundEnergy(scene)
    clearHasMoved(scene)

    decrementEffects(scene, 'npc')
    scene.set('isPlayerTurn', true)
    clearBlock(scene, 'pc')
    applyTurnStartEffects(scene, 'pc')
    drawNewHand(scene)
}
