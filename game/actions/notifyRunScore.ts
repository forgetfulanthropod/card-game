import { GameActions, RUN_SCORE_EVENT_META } from 'shared'

import { getBattleSceneIn } from '@/util'

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

    switch (event) {
        case 'ENEMY_KILLED':
            break
        case 'EXIT_BOSS_FULL_HEALTH':
            break
        case 'EXIT_ROOM_FULL_HEALTH':
            break
    }

    return
}
