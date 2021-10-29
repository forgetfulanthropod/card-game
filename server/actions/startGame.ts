
import { resetRound } from '@/gameState/battle'
import { getBattleScene } from '@/util'


export const TIME_AFTER_PLAYER_MOVE = 1000
export const DEFAULT_WAIT = 1000
export const NOT_YOUR_TURN_REJECTION_WAIT = 1000
export const DEBUG = false

import type { StartGame } from '@shared'
export const startGame: StartGame = async (args) => {
    const scene = getBattleScene('alice')
    if (scene.getK('state') === 'in battle') {
        // already in game
        logger.warn('already started game')
        return
    }
    scene.setK('state', 'in battle')
    await resetRound(scene)
}
