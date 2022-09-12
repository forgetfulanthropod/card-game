import type { GameActions } from 'shared'

import { getBattleSceneIn } from '@/util'

export const confirmNextRoom: GameActions['confirmNextRoom'] = args => {
    const scene = getBattleSceneIn(args.game)
    scene.set('isInMap', false)
    const s = scene.get()
    const isInRestSite = s.rooms[s.numRoomsPassed][0].id === 'REST_SITE'
    scene.set('isInRestSite', isInRestSite)
}
