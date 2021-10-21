import type { OwnedCharacter } from '@shared/index'

import { rulebook } from '../../rulebook'
import { getEntryScene } from '../../util/getters'

export async function changeDungeon({ direction }: { direction: -1 | 1 }): Promise<void> {
    const levels = rulebook.dungeonLevels
    const scene = await getEntryScene('alice')

    let l = (scene.select('selectedLevel').get()).num + direction

    if (l < 1) {
        l = levels.length
    } else if (l > levels.length) {
        l = 1
    }

    scene.select('selectedCharacters').set([])
    scene.select('selectedLevel').set(levels[l - 1])
    await scene.flush()
}

export async function addSelected(args: { character: OwnedCharacter }): Promise<void> {
    const c = args.character
    const scene = await getEntryScene('alice')

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
    await scene.flush()

}
