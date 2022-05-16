import type { BattleCursor } from '@shared'
import { commit } from '@/util'
import { sleep } from '@/util'

import { checkBattleOverMut, handleMove, resetRound } from '..'

const TIME_AFTER_PLAYER_MOVE = 1000
const TIME_BETWEEN_NPC_MOVES = 1000

export async function doNpcTurns(scene: BattleCursor) {
    // if there's another unmoved NPC then make it strike

    await sleep(TIME_AFTER_PLAYER_MOVE)

    for (const move of scene.get('nextNpcMoves') ?? []) {
        const isBattleOver = checkBattleOverMut(scene)
        if (isBattleOver) return

        handleMove({ scene, attackData: move })

        // Check battle over

        commit(scene, scene.get('username'))
        await sleep(TIME_BETWEEN_NPC_MOVES)
    }
    commit(scene, scene.get('username'))
    resetRound(scene)
}

// doNpcTurn -> makeMove -> doMove -> shouldGoAgain() ?-> A -> B -> C ...
// getMoves
// |  |  |
// do do do
