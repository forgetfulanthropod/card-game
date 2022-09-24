import type { StanceId, GameActions } from 'shared'

import { getBattleSceneIn } from '@/util'
import { getNpcMoves, updateHand } from '@/gameState'

export const toggleStance: GameActions['toggleStance'] = args => {
    const { characterUid } = args
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

    const stanceCursor = characterCursor.select('stance')

    const stances: StanceId[] = ['avoidant', 'neutral', 'aggressive']
    const stance = stanceCursor.get()
    const stanceIndex = stances.findIndex(v => stance === v)

    const nextIndex = (stanceIndex + 1) % stances.length

    stanceCursor.set(stances[nextIndex])

    scene.select('nextNpcCommands').set(getNpcMoves(scene))

    updateHand(scene)
}
