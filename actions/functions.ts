import type { BattleScene, Door,SceneName } from '@shared/index'

import { objFilter } from '@/util'

import { tree } from '.'
// import { tree } from '@@/client/data/rootTree'
import type {  } from './doors'
import { getDoorChoices, makeRoom } from './doors'
import type { FBCursor } from './FBCursor'
import { rulebook } from './rulebook/index'

export function changeScene(newSceneName: SceneName): void {
    tree.set('scene', rulebook.initialScenes[newSceneName])
}

export function putUpDoors(): void {
    const scene = (tree.select('scene') as FBCursor<BattleScene>)
    scene.set('doors', getDoorChoices({ dungeonName: 'cool dungeon', roomsPassed: 0 }))
}

export function chooseDoor(door: Door): void {
    const scene = (tree.select('scene') as FBCursor<BattleScene>)
    const room = makeRoom({ door, dungeonName: 'cool dungeon', roomsPassed: 0 })
    scene.apply('allCharacters', ac => ({ ...objFilter(ac, (_, c) => c.isPc), ...room.enemies }))
    scene.set('doors', null)
}

// import { getDoorChoices, makeRoom } from './doors'

// export function doMove() { // API
//     ...
//     if (gameIsOver()) {
//         return getDoorChoices()
//     }
// }

// export function chooseDoor(doorname: string) { // API
//     const newRoom = makeRoom(doorname)
//     db.gameState.set("currentBattle", newRoom)
// }
