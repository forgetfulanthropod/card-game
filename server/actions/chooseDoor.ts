import type { ChooseDoor } from '@serverActions'

import { getRoom, modifyRoom, resetRound } from '@/gameState/battle'
import { commit, getBattleScene, objFilter } from '@/util'


export const chooseDoor: ChooseDoor = async (args) => {

    const scene = getBattleScene('alice')

    const room = modifyRoom(
        getRoom({ door: args.door, dungeonName: scene.get('dungeonName'), roomsPassed: scene.get('roomsPassed') }),
        scene.get('dungeonName'),
    )

    scene.set('doors', { options: [], descriptions: [] })
    scene.set('roomsPassed', scene.get('roomsPassed') + 1)
    scene.apply('allCharacters', ac => ({ ...objFilter(ac, (_, c) => c.isPc), ...room.enemies }))
    scene.set('state', 'in battle')

    await resetRound(scene)

    commit(scene)
}
