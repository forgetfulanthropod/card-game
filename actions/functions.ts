import { tree } from '@@/client/data/rootTree'
import { SceneName } from '@@/client/data/types'
import { rulebook } from '@@/db/data'

export function changeScene(newSceneName: SceneName): void {
    tree.set('scene', rulebook.initialScenes[newSceneName])
}

// import { getDoorChoices, makeRoom } from './doors'

// export function afterTurn() { // API
//     if (gameIsOver()) {
//         return getDoorChoices()
//     }
// }

// export function chooseDoor(doorname: string) { // API
//     const newRoom = makeRoom(doorname)
//     db.gameState.set("currentBattle", newRoom)
// }
