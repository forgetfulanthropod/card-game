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
    resetStances,
    updateNpcMoves,
} from '@/gameState'
import { getBattleSceneIn } from '@/util'
import { getRulebook } from '@/rulebook'
import { setAllCharactersToUnmoved } from '@/gameState/battle/characters/setAllCharactersToUnmoved'

export const nextRoom: GameActions['nextRoom'] = args => {
    const scene = getBattleSceneIn(args.game)

    if (!scene.get('isInMap')) return

    scene.set('turnCount', 1)
    scene.set('isPlayerTurn', true)
    scene.set('numRoomsPassed', scene.get('numRoomsPassed') + 1)

    const chosenRoom = getChosenRoom(scene, args.choice)
    scene.set('currentRoom', chosenRoom)

    scene
        .select('runScore')
        .select('attributes')
        .set('roomsCleared', scene.get('numRoomsPassed')) // handles rest site updating of this field

    const newNpcs = makeNpcsForRoom(chosenRoom.enemies)
    scene.apply('allCharacters', ac => ({
        ...objFilter(ac, (_, c) => c.isPc),
        ...newNpcs,
    }))
    scene.set('state', 'in battle')
    updateNpcMoves(scene)
    setRoundEnergy(scene)
    scene.set('cardsPlayedThisRoom', [])
    scene.set('cardsPlayedThisTurn', [])
    drawNewHand(scene)
    scene.set('damagesDealtThisRoom', [])
    scene.set('isInMap', true)
    scene.select('treasureChest').set('upgraded', false)
    scene.select('treasureChest').set('state', 'pending')
    scene.set('lootScreenHasOpened', false)

    scene.set('isInMap', false)
    const s = scene.get()
    const isInRestSite = s.currentRoom.enemies[0]?.id === 'REST_SITE'
    scene.set('isInRestSite', isInRestSite)
}

function getChosenRoom(scene: BattleCursor, choice: 0 | 1 | 2 | 3) {
    const chosenRoomKey = scene.get('currentRoom').edges[choice]
    const chosenRoom = scene.get('rooms', chosenRoomKey)
    return chosenRoom
}

// function getNextRoom(scene: BattleCursor) {
//     const dungeonName = scene.get('dungeonName')
//     const numRoomsPassed = scene.get('numRoomsPassed')
//     const rooms = getRulebook().dungeonRooms[dungeonName]
//     return rooms[numRoomsPassed % rooms.length]
// }
