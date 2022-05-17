import type { SCursor } from 'sbaobab'
import type { Gamestate } from 'shared'

import { checkBattleOverMut, handleMove } from '@/gameState/battle'
import { getBattleSceneIn } from '@/util'

import type { NextAction } from './step'

const TIME_BETWEEN_NPC_MOVES = 1000

export function doNpcTurn(
    game: SCursor<Gamestate>,
    args: { index: number }
): undefined | NextAction {
    const scene = getBattleSceneIn(game)
    const isBattleOver = checkBattleOverMut(scene)
    if (isBattleOver) return undefined
    const nextMoves = scene.get('nextNpcMoves')
    const move = nextMoves[args.index]
    if (move == null) return undefined // safety check
    handleMove({ scene, attackData: move })

    if (args.index >= nextMoves.length - 1) {
        return {
            args: undefined,
            delay: TIME_BETWEEN_NPC_MOVES,
            type: 'resetRound',
        }
    }
    return {
        args: { index: args.index + 1 },
        delay: TIME_BETWEEN_NPC_MOVES,
        type: 'doNpcTurn',
        origin: 'doNpcTurn',
    }
}

// doNpcTurn -> makeMove -> doMove -> shouldGoAgain() ?-> A -> B -> C ...
// getMoves
// |  |  |
// do do do
