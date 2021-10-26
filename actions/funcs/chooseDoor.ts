

import { handleSpecialDoor, resetRound } from '@/gameState/battle'
import type { SpecialDoorName } from '@/rulebook/battle'
import { getBattleScene, objFilter, onCallWrapper } from '@/util'


export default onCallWrapper(async function chooseDoor(args: { door: SpecialDoorName }): Promise<void> {
    const scene = getBattleScene('alice')

    const room = handleSpecialDoor({ door: args.door, dungeonName: scene.getK('dungeonName'), roomsPassed: scene.getK('roomsPassed') })
    // const room = makeRoom({
    //     door: args.door, dungeonName: 'cool dungeon', roomsPassed: scene.getK('roomsPassed')
    // })
    // console.log('removing doors')
    scene.setK('doors', { options: [], descriptions: [] })
    scene.setK('roomsPassed', scene.getK('roomsPassed') + 1)
    scene.applyK('allCharacters', ac => ({ ...objFilter(ac, (_, c) => c.isPc), ...room.enemies }))
    scene.setK('state', 'in battle')
    await resetRound(scene)
    scene.commit()
})
