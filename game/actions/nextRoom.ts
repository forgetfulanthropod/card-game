import { objFilter } from 'shared/code'
import type { BattleCursor } from 'shared'
import type { GameActions } from './types'
import { resetRound } from './internal'
import {
    makeRoomNpcs,
    clearAllEffects,
    getNpcMoves,
    putAllCardsInDrawPile,
} from '@/gameState'
import { getBattleSceneIn } from '@/util'
import { getRulebook } from '@/rulebook'

export const nextRoom: GameActions['NextRoom'] = args => {
    const scene = getBattleSceneIn(args.game)
    scene.set('roomsPassed', scene.get('roomsPassed') + 1)
    const nextRoom = getNextRoom(scene)
    const newNpcs = makeRoomNpcs(nextRoom)
    scene.apply('allCharacters', ac => ({
        ...objFilter(ac, (_, c) => c.isPc),
        ...newNpcs,
    }))
    scene.set('state', 'in battle')
    scene.set('nextNpcCommands', getNpcMoves(scene))
    clearAllEffects(scene)
    scene.set('turnCount', 1)
    putAllCardsInDrawPile(scene)
    resetRound(args.game, {})
}

function getNextRoom(scene: BattleCursor) {
    const dungeonName = scene.get('dungeonName')
    const roomsPassed = scene.get('roomsPassed')
    const roomsHere = getRulebook().dungeonRooms[dungeonName]
    return roomsHere[roomsPassed + 1] ?? roomsHere[0]
}
