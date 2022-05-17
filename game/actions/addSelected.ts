import type { ServerActions } from '@serverActions'

import { getEntryScene } from '@/util'

export const addSelected: ServerActions['AddSelected'] = args => {
    const c = args.character

    logger.info(args.username)
    const scene = getEntryScene(args.username)

    const allCharacters = scene.select('selectedCharacters').get()

    const indexInSelected = allCharacters.findIndex(
        character => c.uid === character.uid
    )
    if (indexInSelected === -1) {
        scene.apply('selectedCharacters', s => {
            const newS = [...s]
            newS[args.index] = c
            return newS
        })
    }
    // debugger
}
