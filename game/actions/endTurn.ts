import type { ServerActions } from '@serverActions'

import { doNpcTurns, getNpcMoves, resetRound } from '@/gameState/battle'
import { getBattleScene } from '@/util'

import { endRound } from './endRound'

export const endTurn: ServerActions['EndTurn'] = async args => {
    const scene = getBattleScene(args.username)

    endRound(scene)

    await doNpcTurns(scene)

    scene.select('nextNpcMoves').set(getNpcMoves(scene))
    resetRound(scene)
}
