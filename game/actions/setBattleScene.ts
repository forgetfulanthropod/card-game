import type { GameActions } from 'shared'

import { getBattleSceneIn, isProduction } from '@/util'

export const setBattleScene: GameActions['setBattleScene'] = ({
    game,
    scene,
}) => {
    if (isProduction)
        return logger.info('tried to update battle scene in production!')

    const cursor = getBattleSceneIn(game)

    cursor.set(scene)
}
