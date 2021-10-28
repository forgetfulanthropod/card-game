import type { OwnedCharacter } from '@shared'

import { getEntryScene } from '@/util'


export default function addSelected(args: { character: OwnedCharacter }): void {
    const c = args.character
    const scene = getEntryScene('alice')

    const allCharacters = scene.select('selectedCharacters').get()

    const indexInselected = allCharacters.findIndex(character => c.uid === character.uid)
    if (indexInselected !== -1)
        scene.applyK('selectedCharacters', sel => [...sel.slice(0, indexInselected), ...sel.slice(indexInselected + 1)])
    else {
        const totalPoints = [...allCharacters, c]
            .reduce((acc, curr) => {
                return acc + curr.points
            }, 0)

        const pointLimit = scene.select('selectedLevel').select('pointLimit').get()

        if (totalPoints <= pointLimit)
            scene.applyK('selectedCharacters', sel => [...sel, c])
    }
    // debugger
    scene.commit()

}
