import { MyCursor } from '@/config/myBaobab'
import { tree } from '@@/client/data/rootTree'
import { OwnedCharacter, SceneName } from '@@/client/data/types'
import { makeBattleState } from '@@/db/battle/state'
import { rulebook } from '@@/db/data'
import { EntryScene } from '@@/db/entry/types'

export function changeScene(newSceneName: SceneName): void {
    if (newSceneName === 'battle') {
        tree.set('scene', makeBattleState((tree.select('scene') as MyCursor<EntryScene>).select('selectedCharacters').get()))
        return
    }
    tree.set('scene', rulebook.initialScenes[newSceneName])
}

export function addSelected(c: OwnedCharacter): void {
    const scene = tree.select('scene') as MyCursor<EntryScene>

    const indexInselected = scene.select('selectedCharacters').get().findIndex(character => c === character)
    if (indexInselected !== -1)
        scene.apply('selectedCharacters', sel => [...sel.slice(0, indexInselected), ...sel.slice(indexInselected + 1)])
    else {
        const totalPoints = [...scene.select('selectedCharacters').get(), c].reduce((acc, curr) => {
            return acc + curr.points
        }, 0)

        const pointLimit = scene.select('pointLimit').get()

        if (totalPoints <= pointLimit)
            scene.apply('selectedCharacters', sel => [...sel, c])
    }

}
