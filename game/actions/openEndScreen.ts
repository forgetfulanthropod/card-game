import type { GameActions } from 'shared'

import { getBattleSceneIn } from '@/util'

export const openEndScreen: GameActions['openEndScreen'] = args => {
    const scene = getBattleSceneIn(args.game)
    scene.set('endScreenHasOpened', true)
    return
}
