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
import { setAllCharactersToUnmoved } from '@/gameState/battle/setAllCharactersToUnmoved'

export const nextRoom: GameActions['nextRoom'] = args => {
    const scene = getBattleSceneIn(args.game)
    scene.set('turnCount', 1)
    scene.set('isPlayerTurn', true)
    scene.set('numRoomsPassed', scene.get('numRoomsPassed') + 1)
    scene.select('runScore').select('attributes').set('roomsCleared', scene.get('numRoomsPassed')) // handles rest site updating of this field
    const nextRoom = getNextRoom(scene)
    const newNpcs = makeNpcsForRoom(nextRoom)
    setAllCharactersToUnmoved(scene)
    scene.apply('allCharacters', ac => ({
        ...objFilter(ac, (_, c) => c.isPc),
        ...newNpcs,
    }))
    scene.set('state', 'in battle')
    scene.set('nextNpcCommands', getNpcMoves(scene))
    clearAllEffects(scene)
    putAllCardsInDrawPile(scene)
    clearRoomCardModifiers(scene)
    setRoundEnergy(scene)
    scene.set('cardsPlayedThisRoom', [])
    drawNewHand(scene)
    scene.set('damagesDealtThisRoom', [])
    scene.set('isInMap', true)
    scene.select('treasureChest').set('upgraded', false)
    scene.select('treasureChest').set('state', 'pending')
    scene.set('lootScreenHasOpened', false)
}

function getNextRoom(scene: BattleCursor) {
    const dungeonName = scene.get('dungeonName')
    const numRoomsPassed = scene.get('numRoomsPassed')
    const rooms = getRulebook().dungeonRooms[dungeonName]
    return rooms[numRoomsPassed % rooms.length]
}
