
import { getBattleScene, onCallWrapper } from '@/util'

import { resetRound } from '../gameState/battle/resetRound'


export const TIME_AFTER_PLAYER_MOVE = 1000
export const DEFAULT_WAIT = 1000
export const NOT_YOUR_TURN_REJECTION_WAIT = 1000
export const DEBUG = false

export const startGame = onCallWrapper(async function startGame(): Promise<void> {
    const scene = getBattleScene('alice')
    if (scene.getK('state') === 'in battle') {
        // already in game
        console.warn('already started game')
        return
    }
    scene.setK('state', 'in battle')
    await resetRound(scene)
})
