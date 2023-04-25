import type { GameActions } from 'shared'

import { maybeTransitionBattleState } from '@/gameState'
import { isProduction } from '@/util'

export const setBattleScene: GameActions['setBattleScene'] = ({
    game,
    scene,
}) => {
    if (isProduction)
        return logger.info('tried to update battle scene in production!')

    scene.userId = game.get('userId')

    game.set('scene', scene)
    // @ts-expect-error
    maybeTransitionBattleState(game.select('scene'))
}
