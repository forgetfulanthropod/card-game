import { objFilter } from 'shared/code'
import type { BattleCursor } from 'shared'
import type { GameActions } from './types'
import { resetRound } from './internal'
import {
    makeRoomNpcs as makeNpcsForRoom,
    clearAllEffects,
    getNpcMoves,
    putAllCardsInDrawPile,
    clearRoomCardModifiers,
} from '@/gameState'
import { getBattleSceneIn } from '@/util'
import { getRulebook } from '@/rulebook'

export const nextRoom: GameActions['NextRoom'] = args => {
    const scene = getBattleSceneIn(args.game)
    scene.set('numRoomsPassed', scene.get('numRoomsPassed') + 1)
    const nextRoom = getNextRoom(scene)
    const newNpcs = makeNpcsForRoom(nextRoom)
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
    resetRound(args.game, {})
}

function getNextRoom(scene: BattleCursor) {
    const dungeonName = scene.get('dungeonName')
    const numRoomsPassed = scene.get('numRoomsPassed')
    const rooms = getRulebook().dungeonRooms[dungeonName]
    return rooms[numRoomsPassed % rooms.length]
}
