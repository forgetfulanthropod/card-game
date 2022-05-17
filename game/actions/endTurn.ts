import type { GameActions } from '@serverActions'

import { doNpcTurns, getNpcMoves, resetRound } from '@/gameState/battle'
import { getBattleSceneIn } from '@/util'

import { endRound } from './endRound'

export const endTurn: GameActions['EndTurn'] = async args => {
    const scene = getBattleSceneIn(args.game)

    endRound(scene)

    await doNpcTurns(scene)

    scene.select('nextNpcMoves').set(getNpcMoves(scene))
    resetRound(scene)
}
