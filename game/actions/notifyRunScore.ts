import { GameActions, RunScoreEventMapping } from 'shared'

import { getBattleSceneIn } from '@/util'

export const notifyRunScore: GameActions['notifyRunScore'] = args => {
    const { game, event } = args
    const eventCount = args.count
    const scene = getBattleSceneIn(game)

    const attributeNameInTree = RunScoreEventMapping[event]
    const attributeCount = scene
        .select('runScore')
        .select('attributes')
        .select(attributeNameInTree)
    const currCount = attributeCount.get()
    const newCount = currCount + eventCount

    attributeCount.set(newCount)

    switch (event) {
        // below can be used for side effects eg. displaying animations on screen
        case 'ENEMY_KILLED':
            break
        case 'EXIT_BOSS_FULL_HEALTH':
            break
        case 'EXIT_ROOM_FULL_HEALTH':
            break
    }

    return
}
