import type { BattleScene, DungeonName, OwnedCharacterStats } from 'shared'

import { getDungeonRooms } from '@/rulebook/battle'
import {
    getInitialLoot,
    getInitialRunDuration,
    getInitialRunScore,
    getInitialTreasureChest,
} from '.'
import { getNullCards } from './cards'
import { getRoomScoreCounter } from './score'
import { makeCharacters } from './util'

export function makeBattleState(args: {
    chosen?: OwnedCharacterStats[]
    dungeonName?: DungeonName
    game: Gamecursor
}): BattleScene {
    const allCharacters = makeCharacters(args?.chosen)

    // DEBUG
    // kill most of the characters
    // for (let i = 0; i < 12; i++) {
    //     if (i === 0 || i === 6) continue
    //     allCharacters[i].health = -1
    //     // allCharacters
    // }

    // const playerStarts = srandom() < 0.5
    const playerStarts = true
    const rooms = getDungeonRooms()['Hooligans Bluff']

    const bs: BattleScene = {
        username: args.game.get('username'),
        id: 'battle',
        dungeonName: args?.dungeonName ?? 'The Matcha Caves',
        turnCount: 1,
        state: 'in battle',
        playerStarts,
        isPlayerTurn: playerStarts,
        allCharacters,
        cards: getNullCards(),
        newCardOptions: {},
        handSize: 5,
        baseHandSize: 5,
        energy: 3,
        roundEnergy: 3,
        isBasicLoaded: false,
        isDeluxeLoaded: false,
        rooms,
        roomUidsVisited: [],
        numRoomsPassed: -1,
        currentRoom: rooms.root,
        nextNpcCommands: [], // set later
        cardsPlayedThisRoom: [],
        cardsPlayedThisTurn: [],
        blocksAppliedThisTurn: [],
        stanceChangesThisRoom: [],
        damagesDealtThisTurn: [],
        damagesDealtThisRoom: [],
        damagesUnblockedThisTurn: [],
        damagesUnblockedThisRoom: [],
        cardsDrafted: [],
        scoreEventsThisTurn: getRoomScoreCounter(),
        scoreEventsThisRoom: getRoomScoreCounter(),
        queue: [],
        requireAction: null,
        isInMap: true,
        lootEarned: getInitialLoot(),
        lootClaimed: [],
        lootScreenHasOpened: false,
        numRequiredToDiscard: 0,
        endScreenHasOpened: false,
        treasureChest: getInitialTreasureChest(),
        runScore: getInitialRunScore(),
        runDuration: getInitialRunDuration(),
        runId: null,
        souvenirs: [],
    }
    return bs
}
