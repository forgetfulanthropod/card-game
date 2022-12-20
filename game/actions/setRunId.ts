import type { GameActions } from 'shared'

import { getBattleSceneIn } from '@/util'

export const setRunId: GameActions['setRunId'] = async args => {
    const {game, runId} = args
    const scene = getBattleSceneIn(game)
    scene.set('runId', runId)
    return
}
