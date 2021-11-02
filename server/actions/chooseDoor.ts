

import type { ChooseDoor } from '@shared'

import { getRoom, resetRound } from '@/gameState/battle'
import { commit, getBattleScene, objFilter } from '@/util'

export const chooseDoor: ChooseDoor = async (args) => {
    const scene = getBattleScene('alice')

    const room = getRoom({ door: args.door, dungeonName: scene.get('dungeonName'), roomsPassed: scene.get('roomsPassed') })
    // const room = makeRoom({
    //     door: args.door, dungeonName: 'cool dungeon', roomsPassed: scene.get('roomsPassed')
    // })
    // logger.info('removing doors')
    scene.set('doors', { options: [], descriptions: [] })
    scene.set('roomsPassed', scene.get('roomsPassed') + 1)
    scene.apply('allCharacters', ac => ({ ...objFilter(ac, (_, c) => c.isPc), ...room.enemies }))
    scene.set('state', 'in battle')
    await resetRound(scene)
    commit(scene)
}
