import type { GameActions } from '@serverActions'

import { getEntrySceneIn } from '@/util'

export const addSelected: GameActions['AddSelected'] = args => {
    const c = args.character

    const scene = getEntrySceneIn(args.game)

    const allCharacters = scene.select('selectedCharacters').get()

    const indexInSelected = allCharacters.findIndex(
        character => c.uid === character.uid
    )
    if (indexInSelected === -1 || indexInSelected === args.index) {
        scene.apply('selectedCharacters', s => {
            const newS = [...s]
            newS[args.index] = c
            return newS
        })
    } else {
        logger.warn('tried to add already selected character!')
    }
    // debugger
}
