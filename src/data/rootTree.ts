import { MyBaobab, MyCursor } from '../config/myBaobab'
import { BattleState } from './battle/factories'
import { makeInitialState } from './entry/factories'
import { SceneData } from './types'
// import { settings } from './settings'
// type Foo =
// |{sceneName: 'battle', scene: BattleState}
// | {sceneName: 'dungeon entry', scene: Entry}
export const tree = new MyBaobab({
    scene: makeInitialState() as SceneData,
    // battleScene: stuff,
    // entryScene: stuff,
    //settings,
    characters: [],
    items: [],
    // isBasicLoaded: false,
    // isDeluxeLoaded: false,
})

// @ts-ignore
window.tree = tree

// export const getBattleScene = () => {
//     const curType = tree.select('scene').select('type').get()
//     if (curType != 'battle') {
//         throw new Error(`tried to get battle scene when you\'re in ${curType}`)
//     }
//     tree.select('scene') as BattleState
// }
export const getBattleScene = () => {
    const curType = tree.select('scene').select('type').get()
    if (curType != 'battle') {
        throw new Error(`tried to get battle scene when you\'re in ${curType}`)
    }
    return tree.select('scene') as MyCursor<BattleState>
}
export const getScene = () => tree.select('scene')
export const scene = tree.select('scene')
export const allCharacters = tree.select('characters')
export const getBattleSceneData = () => getBattleScene().get()
