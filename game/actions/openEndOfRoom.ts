import type { GameActions } from 'shared'

import { getBattleSceneIn } from '@/util'

export const openEndOfRoom: GameActions['openEndOfRoom'] = args => {
    const scene = getBattleSceneIn(args.game)
        scene.set('lootScreenHasOpened', true)
    return
}
