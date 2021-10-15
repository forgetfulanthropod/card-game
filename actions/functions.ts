import type { ChangeScene, ChooseDoor, PutUpDoors } from '@shared/actions'
import type { BattleScene } from '@shared/index'

import { tree } from '.'
import { getDoorChoices, makeRoom } from './doors'
import type { FBCursor } from './FBCursor'
import { rulebook } from './rulebook/index'
import { objFilter } from './util'

export const changeScene_: ChangeScene = newSceneName => {
    tree.set('scene', rulebook.initialScenes[newSceneName])
}

export const putUpDoors_: PutUpDoors = () => {
    const scene = (tree.select('scene') as FBCursor<BattleScene>)
    scene.set('doors', getDoorChoices({ dungeonName: 'cool dungeon', roomsPassed: 0 }))
}

export const chooseDoor_: ChooseDoor = door => {
    const scene = (tree.select('scene') as FBCursor<BattleScene>)
    const room = makeRoom({ door, dungeonName: 'cool dungeon', roomsPassed: 0 })
    scene.apply('allCharacters', ac => ({ ...objFilter(ac, (_, c) => c.isPc), ...room.enemies }))
    scene.set('doors', null)
}
