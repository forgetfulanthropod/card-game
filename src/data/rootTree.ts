import Baobab from 'baobab'
import { MyBaobab } from 'config/myBaobab'
import { battle } from './battle'
// import { State } from './battle/factories'

// interface Tree {
//     scene: typeof battle,
//     characters: [],
//     items: [],
// }
const tree = new MyBaobab({
    scene: battle,
    characters: [],
    items: [],
})

export const scene = tree.select('scene')
export const sceneData = scene.get()
