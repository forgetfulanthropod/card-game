import type { InternalActions } from 'shared'

import { getBattleSceneIn } from '@/util'
import { activateSouvenirs } from '@/gameState/battle/activateSouvenirs'
import { updateHand, updateNpcMoves } from '@/gameState'
import { updateCharacters } from '@/gameState/battle/characters/updateCharacters'
import { triggerOnHook } from '@/gameState/battle/commandHookUtil'

export const activatePlayCardHooks: InternalActions['activatePlayCardHooks'] =
    ({ game, card }) => {
        const scene = getBattleSceneIn(game)

        triggerOnHook(scene, 'playCard')
        if (card.type === 'attack') triggerOnHook(scene, 'playAttackCard')

        activateSouvenirs('playCard', scene, card.characterUid)

        updateNpcMoves(scene)
        updateCharacters(scene)
        updateHand(scene)
    }
