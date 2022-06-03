import type { NextAction } from 'shared'

import { endRound } from './endRound'
import { getBattleSceneIn } from '@/util'
import {
    applyTurnStartEffects,
    clearBlock,
    decrementEffects,
} from '@/gameState'

const TIME_AFTER_PLAYER_MOVE = 1000

// GameActions['EndTurn']
export const endTurn = (args: { game: Gamecursor }): NextAction => {
    const scene = getBattleSceneIn(args.game)

    decrementEffects(scene, 'pc')
    endRound(scene)
    clearBlock(scene, 'npc')
    applyTurnStartEffects(scene, 'npc')

    return {
        type: 'doNpcTurn',
        args: { index: 0 },
        delay: TIME_AFTER_PLAYER_MOVE,
    }
}
