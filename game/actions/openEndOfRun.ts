import type { GameActions } from 'shared'

import { getBattleSceneIn } from '@/util'

export const openEndOfRun: GameActions['openEndOfRun'] = args => {
    const scene = getBattleSceneIn(args.game)
    scene.set('endScreenHasOpened', true)
    return
}
