import {
    drawNewHand,
    makeRoomNpcs as makeNpcsForRoom,
    setRoundEnergy,
    updateNpcMoves,
} from '@/gameState'
import { activateSouvenirs } from '@/gameState/battle/activateSouvenirs'
import { getRoomScoreCounter } from '@/gameState/battle/score'
import { getBattleSceneIn } from '@/util'
import { trackMetric } from 'server/metrics'
import {
    BattleCursor,
    disableEventScene,
    DungeonRoom,
    GameActions,
} from 'shared'
import { objFilter } from 'shared/code'

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

        if (!disableEventScene) {
            scene.set(
                'isInEventScene',
                scene.get('currentRoom', 'category') === 'events'
            )
        }
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

    scene.set('cardsPlayedThisRoom', [])
    scene.set('cardsPlayedThisTurn', [])
    scene.set('damagesDealtThisRoom', [])
    scene.set('damagesDealtThisTurn', [])
    scene.set('damagesUnblockedThisTurn', [])
    scene.set('damagesUnblockedThisRoom', [])
    scene.set('scoreEventsThisTurn', getRoomScoreCounter())
    scene.set('scoreEventsThisRoom', getRoomScoreCounter())

    scene.select('treasureChest').set('upgraded', false)
    scene.select('treasureChest').set('state', 'pending')

    const newNpcs = makeNpcsForRoom(chosenRoom.enemies)
    scene.apply('allCharacters', ac => ({
        ...objFilter(ac, (_, c) => c.isPc),
        ...newNpcs,
    }))
    activateSouvenirs('battleStart', scene)

    scene.set('state', 'in battle')
    scene.set('lootScreenHasOpened', false)

    updateNpcMoves(scene)
    setRoundEnergy(scene)
    drawNewHand(scene)
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
