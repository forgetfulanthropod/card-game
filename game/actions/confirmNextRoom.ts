import type { GameActions } from 'shared'

import { getBattleSceneIn } from '@/util'

export const confirmNextRoom: GameActions['confirmNextRoom'] = args => {
    const scene = getBattleSceneIn(args.game)
    scene.set('isInMap', false)
}
