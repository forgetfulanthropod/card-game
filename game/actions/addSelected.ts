import type { AddSelected } from '@serverActions'

import { getEntryScene } from '@/util'

export const addSelected: AddSelected = args => {
    const c = args.character

    logger.info(args.username)
    const scene = getEntryScene(args.username)

    const allCharacters = scene.select('selectedCharacters').get()

    const indexInSelected = allCharacters.findIndex(
        character => c.uid === character.uid
    )
    if (indexInSelected === -1 || indexInSelected === args.index) {
        scene.apply('selectedCharacters', s => {
            const newS = [...s]
            newS[args.index] = c
            logger.info(JSON.stringify({ s }))
            logger.info('\n\n\n')
            logger.info(JSON.stringify({ newS }))
            return newS
        })
    } else {
        logger.warn('tried to add already selected character!')
    }
    // debugger
}
