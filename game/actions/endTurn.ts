import type { SCursor } from 'sbaobab'
import type { Gamestate, NextAction } from 'shared'

import { getNpcMoves } from '@/gameState/battle'
import { getBattleSceneIn } from '@/util'

import { endRound } from './endRound'
const TIME_AFTER_PLAYER_MOVE = 1000

// GameActions['EndTurn']
export const endTurn = (args: { game: SCursor<Gamestate> }): NextAction => {
    const scene = getBattleSceneIn(args.game)

    endRound(scene)
    scene.select('nextNpcMoves').set(getNpcMoves(scene))
    return {
        type: 'doNpcTurn',
        args: { index: 0 },
        delay: TIME_AFTER_PLAYER_MOVE,
    }

    // await doNpcTurns(scene)

    // resetRound(scene)
}

export function doInternalAction() {}
