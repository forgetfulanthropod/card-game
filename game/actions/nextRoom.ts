import {
    drawNewHand,
    makeRoomNpcs as makeNpcsForRoom,
    setRoundEnergy,
    updateNpcMoves,
} from '@/gameState'
import { activateSouvenirs } from '@/gameState/battle/activateSouvenirs'
import {
    activateTalents,
    activateTalentsGeneric,
} from '@/gameState/battle/Talents'
import { getRoomScoreCounter } from '@/gameState/battle/score'
import { getBattleSceneIn } from '@/util'
import { trackMetric } from 'server/metrics'
import { BattleCursor, CharacterClass, DungeonRoom, GameActions } from 'shared'
import { produce } from 'immer'
import { calculateBaseTaunt, objFilter } from 'shared/code'

export const nextRoom: GameActions['nextRoom'] = args => {
    const scene = getBattleSceneIn(args.game)

    if (!scene.get('isInMap')) return

    scene.set('numRoomsPassed', scene.get('numRoomsPassed') + 1)
    const chosenRoom = getChosenRoom(scene, args.choice)
    scene.apply('roomUidsVisited', uids => [...uids, chosenRoom.uid])
    scene.set('currentRoom', chosenRoom)

    if (chosenRoom.category === 'restSite') {
        activateSouvenirs('enterRestSite', scene)
        activateTalentsGeneric(scene, 'enterRestSite')
    } else if (chosenRoom.category === 'events') {
        activateSouvenirs('enterEventSite', scene)
        activateTalentsGeneric(scene, 'enterEventSite')
    }

    trackMetric('nextRoom', { choice: args.choice, chosenRoom, scene })

    const currentRoomCategory = scene.get('currentRoom', 'category')

    if (
        currentRoomCategory !== 'restSite' &&
        currentRoomCategory !== 'events'
    ) {
        prepareBattleScene(scene, chosenRoom)
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

    setBaseTaunt(scene)
    setRoundEnergy(scene)
    activateSouvenirs('battleStart', scene)
    activateTalentsGeneric(scene, 'battleStart')
    activateSouvenirs('turnStart', scene)
    activateTalentsGeneric(scene, 'turnStart')

    scene.set('state', 'in battle')
    scene.set('lootScreenHasOpened', false)

    updateNpcMoves(scene)
    drawNewHand(scene)
}

function getChosenRoom(scene: BattleCursor, choice: 0 | 1 | 2 | 3) {
    const chosenRoomKey = scene.get('currentRoom').edges[choice]
    const chosenRoom = scene.get('rooms', chosenRoomKey)
    return chosenRoom
}

const setBaseTaunt = (scene: BattleCursor) => {
    scene.apply(
        'allCharacters',
        produce(ac => {
            for (const [id, cm] of Object.entries(ac)) {
                if (!cm.isPc) continue
                const taunt = calculateBaseTaunt(cm)
                cm.taunt = taunt
                cm.lastTaunt = taunt
            }
            return ac
        })
    )
}

// function getNextRoom(scene: BattleCursor) {
//     const dungeonName = scene.get('dungeonName')
//     const numRoomsPassed = scene.get('numRoomsPassed')
//     const rooms = getRulebook().dungeonRooms[dungeonName]
//     return rooms[numRoomsPassed % rooms.length]
// }
