import type { GameActions } from 'shared'

import { getBattleSceneIn, isProduction } from '@/util'
import { maybeTransitionBattleState } from '@/gameState'

export const setBattleScene: GameActions['setBattleScene'] = ({
    game,
    scene,
}) => {
    if (isProduction)
        return logger.info('tried to update battle scene in production!')

    scene.username = game.get('username')

    game.set('scene', scene)
    // @ts-expect-error
    maybeTransitionBattleState(game.select('scene'))
}
