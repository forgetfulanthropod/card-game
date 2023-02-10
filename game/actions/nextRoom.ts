import {
    drawNewHand,
    makeRoomNpcs as makeNpcsForRoom,
    setRoundEnergy,
    updateNpcMoves,
} from '@/gameState'
import { getBattleSceneIn } from '@/util'
import { trackMetric } from 'server/metrics'
import type { BattleCursor, DungeonRoom, GameActions } from 'shared'
import { objFilter } from 'shared/code'

const disableEventScene = true

export const nextRoom: GameActions['nextRoom'] = args => {
    const scene = getBattleSceneIn(args.game)

    if (!scene.get('isInMap')) return

    scene.set('numRoomsPassed', scene.get('numRoomsPassed') + 1)
    const chosenRoom = getChosenRoom(scene, args.choice)
    scene.apply('roomUidsVisited', uids => [...uids, chosenRoom.uid])
    scene.set('currentRoom', chosenRoom)
    trackMetric('nextRoom', { choice: args.choice, chosenRoom, scene })

    const currentRoomCategory = scene.get('currentRoom', 'category')

    if (
        currentRoomCategory !== 'restSite' &&
        (disableEventScene || currentRoomCategory !== 'events')
    ) {
        prepareBattleScene(scene, chosenRoom)
    } else {
        scene.set(
            'isInRestSite',
            scene.get('currentRoom', 'category') === 'restSite'
        )

        if (!disableEventScene)
            scene.set(
                'isInEventScene',
                scene.get('currentRoom', 'category') === 'events'
            )
    }

    scene.set('isInMap', false)
}

function prepareBattleScene(scene: BattleCursor, chosenRoom: DungeonRoom) {
    scene.set('turnCount', 1)
    scene.set('isPlayerTurn', true)

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
    scene.set('lootScreenHasOpened', false)

    updateNpcMoves(scene)
    setRoundEnergy(scene)

    scene.set('cardsPlayedThisRoom', [])
    scene.set('cardsPlayedThisTurn', [])
    drawNewHand(scene)
    scene.set('damagesDealtThisRoom', [])

    scene.select('treasureChest').set('upgraded', false)
    scene.select('treasureChest').set('state', 'pending')
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
