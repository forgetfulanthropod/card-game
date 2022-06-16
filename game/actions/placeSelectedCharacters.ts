import produce from 'immer'
import type { GameActions } from 'shared'

import { getEntrySceneIn } from '@/util'

export const placeSelectedCharacters: GameActions['placeSelectedCharacters'] =
    args => {
        const scene = getEntrySceneIn(args.game)
        scene.apply(
            'selectedCharacters',
            produce(selected => {
                for (const { character, index } of args.characters) {
                    selected[index] = character
                }
            })
        )
    }
