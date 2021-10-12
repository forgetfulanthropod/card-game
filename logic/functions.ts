import { MyCursor } from '@/config/myBaobab'
import { tree } from '@@/client/data/rootTree'
import { OwnedCharacter, SceneName } from '@@/client/data/types'
import { makeBattleState } from '@@/db/battle/state'
import { rulebook } from '@@/db/data'
import { EntryState } from '@@/db/entry/types'

export function changeScene(newSceneName: SceneName): void {
    if (newSceneName === 'battle') {
        tree.set('scene', makeBattleState((tree.select('scene') as MyCursor<EntryState>).select('selectedCharacters').get()))
        return
    }
    tree.set('scene', rulebook.initialScenes[newSceneName])
}

export function addSelected(c: OwnedCharacter): void {
    const scene = tree.select('scene') as MyCursor<EntryState>
    scene.apply('selectedCharacters', sel => [...sel, c])
}
