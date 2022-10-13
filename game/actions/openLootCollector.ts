import type { GameActions } from 'shared'

import { getBattleSceneIn } from '@/util'

export const openLootCollector: GameActions['openLootCollector'] = args => {
    const scene = getBattleSceneIn(args.game)
        scene.set('lootScreenHasOpened', true)
    return
}
