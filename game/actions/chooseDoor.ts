import type { GameActions } from '@serverActions'

import { resetRound } from './internal'
import {
    getNpcMoves,
    getRoom,
    modifyRoom,
    putAllCardsInDrawPile,
    clearAllEffects,
    resetTurns,
} from '@/gameState'
import { getBattleSceneIn, objFilter } from '@/util'

export const chooseDoor: GameActions['ChooseDoor'] = args => {
    const scene = getBattleSceneIn(args.game)

    const room = modifyRoom(
        getRoom({
            door: args.door,
            dungeonName: scene.get('dungeonName'),
            roomsPassed: scene.get('roomsPassed'),
            game: args.game,
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
    resetRound(args.game, {})
}
