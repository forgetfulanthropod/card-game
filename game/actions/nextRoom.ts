import { objFilter } from 'shared/code'
import type { BattleCursor, GameActions } from 'shared'
import {
    makeRoomNpcs as makeNpcsForRoom,
    clearAllEffects,
    getNpcMoves,
    putAllCardsInDrawPile,
    clearRoomCardModifiers,
    drawNewHand,
    setRoundEnergy,
} from '@/gameState'
import { getBattleSceneIn } from '@/util'
import { getRulebook } from '@/rulebook'

export const nextRoom: GameActions['nextRoom'] = args => {
    const scene = getBattleSceneIn(args.game)
    scene.set('numRoomsPassed', scene.get('numRoomsPassed') + 1)
    const nextRoom = getNextRoom(scene)
    const newNpcs = makeNpcsForRoom(nextRoom)
    setRoundEnergy(scene)
    scene.apply('allCharacters', ac => ({
        ...objFilter(ac, (_, c) => c.isPc),
        ...newNpcs,
    }))
    scene.set('state', 'in battle')
    scene.set('nextNpcCommands', getNpcMoves(scene))
    clearAllEffects(scene)
    clearRoomCardModifiers(scene)
    scene.set('turnCount', 1)
    putAllCardsInDrawPile(scene)
    scene.set('cardsPlayedThisRoom', [])
    drawNewHand(scene)
    scene.set('isInMap', true)
}

function getNextRoom(scene: BattleCursor) {
    const dungeonName = scene.get('dungeonName')
    const numRoomsPassed = scene.get('numRoomsPassed')
    const rooms = getRulebook().dungeonRooms[dungeonName]
    return rooms[numRoomsPassed % rooms.length]
}
