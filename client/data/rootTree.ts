import { BattleScene } from '@@/db/battle/types'
import { initialGameState } from '@@/db/data'
import { MyBaobab, MyCursor } from '../config/myBaobab'
import { Scene } from './types'
// import { settings } from './settings'
// type Foo =
// |{sceneName: 'battle', scene: BattleScene}
// | {sceneName: 'dungeon entry', scene: Entry}
export const tree = new MyBaobab(initialGameState)

// export const commitTree = () => tree.commit()

// @ts-ignore
window.tree = tree

// export const getBattleScene = () => {
//     const curType = tree.select('scene').select('type').get()
//     if (curType != 'battle') {
//         throw new Error(`tried to get battle scene when you\'re in ${curType}`)
//     }
//     tree.select('scene') as BattleScene
// }
export const getBattleScene = (): MyCursor<BattleScene> => {
    const curType = tree.select('scene').select('name').get()
    if (curType !== 'battle') {
        throw new Error(`tried to get battle scene when you're in ${curType}`)
    }
    return tree.select('scene') as MyCursor<BattleScene>
}
export const getScene = (): MyCursor<Scene> => tree.select('scene')
export const scene = tree.select('scene')
export const ownedCharacters = tree.select('ownedCharacters')
export const getBattleSceneData = (): BattleScene => getBattleScene().get()
