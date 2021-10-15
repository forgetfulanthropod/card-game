import type { BattleScene, Door, SceneName } from '@shared/index'

import { tree } from '.'
import { getDoorChoices, makeRoom } from './doors'
import type { FBCursor } from './FBCursor'
import { rulebook } from './rulebook/index'
import { objFilter } from './util'

export function changeScene_(newSceneName: SceneName): void {
    tree.set('scene', rulebook.initialScenes[newSceneName])
}

export function putUpDoors_(): void {
    const scene = (tree.select('scene') as FBCursor<BattleScene>)
    scene.set('doors', getDoorChoices({ dungeonName: 'cool dungeon', roomsPassed: 0 }))
}

export function chooseDoor_(door: Door): void {
    const scene = (tree.select('scene') as FBCursor<BattleScene>)
    const room = makeRoom({ door, dungeonName: 'cool dungeon', roomsPassed: 0 })
    scene.apply('allCharacters', ac => ({ ...objFilter(ac, (_, c) => c.isPc), ...room.enemies }))
    scene.set('doors', null)
}
