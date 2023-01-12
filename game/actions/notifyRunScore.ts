import { updateScore } from '@/gameState'
import { getBattleSceneIn } from '@/util'
import { GameActions } from 'shared'

export const notifyRunScore: GameActions['notifyRunScore'] = args => {
    updateScore({ ...args, scene: getBattleSceneIn(args.game) })
}
