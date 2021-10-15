import { getEntryScene } from '@/data/rootTree'
import { OwnedCharacter } from '@/data/types'
import { rulebook } from '@@/db/rulebook'

export function changeDungeon(dir: -1 | 1): void {
    const levels = rulebook.dungeonLevels
    const scene = getEntryScene()

    let l = scene.select('selectedLevel').get().num + dir

    if (l < 1) {
        l = levels.length
    } else if (l > levels.length) {
        l = 1
    }

    scene.select('selectedCharacters').set([])
    scene.select('selectedLevel').set(levels[l - 1])
}

export function addSelected(c: OwnedCharacter): void {
    const scene = getEntryScene()

    const indexInselected = scene.select('selectedCharacters').get().findIndex(character => c === character)
    if (indexInselected !== -1)
        scene.apply('selectedCharacters', sel => [...sel.slice(0, indexInselected), ...sel.slice(indexInselected + 1)])
    else {
        const totalPoints = [...scene.select('selectedCharacters').get(), c].reduce((acc, curr) => {
            return acc + curr.points
        }, 0)

        const pointLimit = scene.select('selectedLevel').select('pointLimit').get()

        if (totalPoints <= pointLimit)
            scene.apply('selectedCharacters', sel => [...sel, c])
    }

}
