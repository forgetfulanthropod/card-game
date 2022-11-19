import type { GameActions } from 'shared'

import { getBattleSceneIn } from '@/util'
import {
    applyTurnStartEffects,
    clearBlock,
    decrementEffects,
    popAndRunQueue,
    endRound,
} from '@/gameState'
import { clearCharacterStatModifiers } from '@/gameState/battle/characters/clearCharacterStatModifiers'

const TIME_AFTER_PLAYER_MOVE = 1000

export const endTurn: GameActions['endTurn'] = args => {
    const scene = getBattleSceneIn(args.game)

    endRound(scene)
    clearBlock(scene, 'npc')

    applyTurnStartEffects(scene, 'pc')
    applyTurnStartEffects(scene, 'npc')
    clearCharacterStatModifiers(scene, 'round')

    popAndRunQueue(scene, 'npc')

    args.game.set('nextAction', {
        index: 0,
        method: 'doNpcTurn',
        delay: TIME_AFTER_PLAYER_MOVE,
    })
}
