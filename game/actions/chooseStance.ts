import type { StanceId, GameActions } from 'shared'

import { getBattleSceneIn } from '@/util'
import { updateNpcMoves, updateHand } from '@/gameState'
import { trackMetric } from 'server/metrics'

export const chooseStance: GameActions['chooseStance'] = args => {
    const { characterUid, stanceId } = args
    const scene = getBattleSceneIn(args.game)

    const characterCursor = scene.select('allCharacters').select(characterUid)
    const character = characterCursor.get()

    if (
        !character.isPc ||
        character.hasMoved ||
        !scene.get().isPlayerTurn
        //  || scene.get().selectedCharacter !== character.uid
    )
        return

    logger.debug(`${character.id} setting stance to ${stanceId}`)

    characterCursor.select('stance').set(stanceId)

	// TODO: disable until all metrics write are async;
	// otherwise delay in changing stance doesn't feel good
	// discussion: possibly don't even need this since stance is included
	// with play card

    // trackMetric('chooseStance', { character, stanceId, scene })

    updateNpcMoves(scene)

    updateHand(scene)
}
