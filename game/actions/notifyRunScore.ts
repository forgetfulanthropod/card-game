import { GameActions, RUN_SCORE_EVENT_META } from 'shared'

import { getBattleSceneIn } from '@/util'
import { calculateChestProgress, calculateNewRunScore } from '@/gameState'

export const notifyRunScore: GameActions['notifyRunScore'] = args => {
    const { game, event, count } = args
    const scene = getBattleSceneIn(game)

    const attributeNameInTree = RUN_SCORE_EVENT_META[event].attributeName
    const attributeCount = scene
        .select('runScore')
        .select('attributes')
        .select(attributeNameInTree)

    const currCount = attributeCount.get()
    const newCount = currCount + count

    attributeCount.set(newCount)
    // 2 calls below might be unnecessary
    calculateNewRunScore(scene)
    calculateChestProgress(scene)
    return
}
