import type { AddSelected } from '@serverActions'

import { getEntryScene } from '@/util'

export const addSelected: AddSelected = args => {
    const c = args.character

    logger.info(args.username)
    const scene = getEntryScene(args.username)

    const allCharacters = scene.select('selectedCharacters').get()

    const indexInselected = allCharacters.findIndex(
        character => c.uid === character.uid
    )
    if (indexInselected !== -1)
        scene.apply('selectedCharacters', sel => [
            ...sel.slice(0, indexInselected),
            ...sel.slice(indexInselected + 1),
        ])
    else {
        scene.apply('selectedCharacters', sel => [...sel, c])
    }
    // debugger
}
