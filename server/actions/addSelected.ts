import type { AddSelected } from '@serverActions'

import { commit, getEntryScene } from '@/util'


export const addSelected: AddSelected = (args) => {
    const c = args.character
    const scene = getEntryScene('alice')

    const allCharacters = scene.select('selectedCharacters').get()

    const indexInselected = allCharacters.findIndex(character => c.uid === character.uid)
    if (indexInselected !== -1)
        scene.apply('selectedCharacters', sel => [...sel.slice(0, indexInselected), ...sel.slice(indexInselected + 1)])
    else {
        const totalPoints = [...allCharacters, c]
            .reduce((acc, curr) => {
                return acc + curr.points
            }, 0)

        const pointLimit = scene.select('selectedLevel').select('pointLimit').get()

        if (totalPoints <= pointLimit)
            scene.apply('selectedCharacters', sel => [...sel, c])
    }
    // debugger
    commit(scene)

}
