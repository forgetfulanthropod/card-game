import type { GameActions } from 'shared'

import { getBattleSceneIn } from '@/util'

export const collectLoot: GameActions['collectLoot'] = args => {
    const scene = getBattleSceneIn(args.game)
    scene.set('state', 'choosing cards')
}
