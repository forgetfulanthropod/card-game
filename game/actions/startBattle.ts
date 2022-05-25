import { nextRoom } from './nextRoom'
import type { GameActions } from './types'
import { getBattleSceneIn } from '@/util'

export const startBattle: GameActions['StartBattle'] = args => {
    const scene = getBattleSceneIn(args.game)
    if (scene.get('state') === 'in battle') {
        // already in game
        logger.warn('already started game')
        return
    }
    scene.set('state', 'in battle')
    nextRoom({ game: args.game })
}
