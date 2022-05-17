import type { ServerActions } from '@serverActions'

import {
    getNpcMoves,
    getRoom,
    modifyRoom,
    resetRound,
} from '@/gameState/battle'
import { putAllCardsInDrawPile } from '@/gameState/battle/cards/putAllCardsInDrawPile'
import { clearAllEffects } from '@/gameState/battle/clearAllEffects'
import { resetTurns } from '@/gameState/battle/resetTurns'
import { getBattleScene, objFilter } from '@/util'

export const chooseDoor: ServerActions['ChooseDoor'] = args => {
    const scene = getBattleScene(args.username)

    const room = modifyRoom(
        getRoom({
            door: args.door,
            dungeonName: scene.get('dungeonName'),
            roomsPassed: scene.get('roomsPassed'),
            username: args.username,
        }),
        scene.get('dungeonName')
    )

    scene.set('doors', { options: [], descriptions: [] })
    scene.set('roomsPassed', scene.get('roomsPassed') + 1)
    scene.apply('allCharacters', ac => ({
        ...objFilter(ac, (_, c) => c.isPc),
        ...room.enemies,
    }))
    scene.set('state', 'in battle')
    scene.set('nextNpcMoves', getNpcMoves(scene))

    clearAllEffects(scene)
    resetTurns(scene)
    putAllCardsInDrawPile(scene)
    resetRound(scene)
}
