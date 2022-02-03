import type { EndTurn } from '@serverActions'

import { doNpcTurn, resetRound } from '@/gameState/battle'
import { getBattleScene } from '@/util'

import { endRound } from './endRound'

export const endTurn: EndTurn = async args => {
    const scene = getBattleScene(args.username)

    endRound(scene)

    await doNpcTurn(scene)

    resetRound(scene)
}
