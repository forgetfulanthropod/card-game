import type { GameActions } from '@serverActions'
import type { StanceName } from 'shared'

import { getModified } from '@/gameState/battle'
import { getBattleSceneIn } from '@/util'

export const toggleStance: GameActions['ToggleStance'] = args => {
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

    const stances: StanceName[] = ['defensive', 'neutral', 'aggressive']
    const stance = stanceCursor.get()
    const stanceIndex = stances.findIndex(v => stance === v)

    const nextIndex = (stanceIndex + 1) % stances.length

    stanceCursor.set(stances[nextIndex])

    characterCursor.apply(ch => getModified(args.game.get('blessings'), ch))
}
