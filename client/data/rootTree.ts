import { initialState } from '@@/db/battle/state'
import { BattleScene } from "@@/db/battle/types"
import { MyBaobab, MyCursor } from '../config/myBaobab'
import { SceneData } from './types'
// import { settings } from './settings'
// type Foo =
// |{sceneName: 'battle', scene: BattleScene}
// | {sceneName: 'dungeon entry', scene: Entry}
export const tree = new MyBaobab({
    scene: initialState as SceneData,
    // battleScene: stuff,
    // entryScene: stuff,
    //settings,
    characters: [],
    items: [],
    // isBasicLoaded: false,
    // isDeluxeLoaded: false,
})

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
    const curType = tree.select('scene').select('type').get()
    if (curType !== 'battle') {
        throw new Error(`tried to get battle scene when you\'re in ${curType}`)
    }
    return tree.select('scene') as MyCursor<BattleScene>
}
export const getScene = (): MyCursor<SceneData> => tree.select('scene')
export const scene = tree.select('scene')
export const allCharacters = tree.select('characters')
export const getBattleSceneData = (): BattleScene => getBattleScene().get()
