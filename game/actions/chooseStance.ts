import type { StanceId, GameActions } from 'shared'

import { getBattleSceneIn } from '@/util'
import { updateNpcMoves, updateHand } from '@/gameState'

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

    logger.info(`setting stance to ${stanceId}`)

    characterCursor.select('stance').set(stanceId)

    updateNpcMoves(scene)

    updateHand(scene)
}
