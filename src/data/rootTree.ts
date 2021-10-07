import { MyBaobab } from '../config/myBaobab'
import { makeInitialBattleState } from './battle'
// import { settings } from './settings'
const tree = new MyBaobab({
    scene: makeInitialBattleState(),
    //settings,
    characters: [],
    items: [],
})

// export const commitTree = () => tree.commit()

// @ts-ignore
window.tree = tree

export const getScene = () => tree.select('scene')
export const getSceneData = () => tree.select('scene').get()
