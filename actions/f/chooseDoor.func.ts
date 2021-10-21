import type { Door } from '@shared/datamodel'

import { resetRound } from '../gameState/battle/allBattleLogic'
import { makeRoom } from '../gameState/battle/doors'
import { getBattleScene } from '../util/getters'
import { objFilter } from '../util/objectMethods'
import { onCallWrapper } from '../util/onCallWrapper'

export default onCallWrapper(async function chooseDoor(args: { door: Door }): Promise<void> {
    const scene = await getBattleScene('alice')
    const room = makeRoom({
        door: args.door, dungeonName: 'cool dungeon', roomsPassed: scene.getK('roomsPassed')
    })
    // console.log('removing doors')
    scene.setK('doors', { options: [], descriptions: [] })
    scene.setK('roomsPassed', scene.getK('roomsPassed') + 1)
    scene.applyK('allCharacters', ac => ({ ...objFilter(ac, (_, c) => c.isPc), ...room.enemies }))
    scene.setK('state', 'in battle')
    await resetRound(scene)
    await scene.flush()
})
