import type { NextAction } from 'shared'

import { endRound } from './endRound'
import { getNpcMoves } from '@/gameState'
import { getBattleSceneIn } from '@/util'

const TIME_AFTER_PLAYER_MOVE = 1000

// GameActions['EndTurn']
export const endTurn = (args: { game: Gamecursor }): NextAction => {
    const scene = getBattleSceneIn(args.game)

    endRound(scene)
    scene.select('nextNpcMoves').set(getNpcMoves(scene))
    return {
        type: 'doNpcTurn',
        args: { index: 0 },
        delay: TIME_AFTER_PLAYER_MOVE,
    }
}
