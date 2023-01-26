import type { BattleScene, DungeonName, OwnedCharacterStats } from 'shared'

import { getNullCards } from './cards'
import { makeCharacters } from './util'
import {
    getInitialLoot,
    getInitialTreasureChest,
    getInitialRunScore,
    getInitialRunDuration,
} from '.'
import { getRulebook } from '@/rulebook'

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
        energy: 3,
        roundEnergy: 3,
        isBasicLoaded: false,
        isDeluxeLoaded: false,
        rooms: getRulebook().dungeonRooms['Hooligans Bluff'],
        roomUidsVisited: [],
        numRoomsPassed: -1,
        currentRoom: getRulebook().dungeonRooms['Hooligans Bluff'].root,
        nextNpcCommands: [], // set later
        cardsPlayedThisRoom: [],
        cardsPlayedThisTurn: [],
        blocksAppliedThisTurn: [],
        stanceChangesThisRoom: [],
        damagesDealtThisTurn: [],
        damagesDealtThisRoom: [],
        queue: [],
        requireAction: null,
        isInMap: true,
        isInRestSite: false,
        lootEarned: getInitialLoot(),
        lootClaimed: [],
        lootScreenHasOpened: false,
        endScreenHasOpened: false,
        treasureChest: getInitialTreasureChest(),
        runScore: getInitialRunScore(),
        runScoreUpdate: null,
        runDuration: getInitialRunDuration(),
        runId: null,
    }
    return bs
}
