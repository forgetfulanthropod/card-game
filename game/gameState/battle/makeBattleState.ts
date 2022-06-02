import type { BattleScene, DungeonName, OwnedCharacterStats } from 'shared'

import { getNullCards } from './cards'
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

    const bs: BattleScene = {
        username: args.game.get('username'),
        name: 'battle',
        dungeonName: args?.dungeonName ?? 'The Matcha Caves',
        turnCount: 1,
        state: 'not started',
        playerStarts,
        isPlayerTurn: playerStarts,
        allCharacters,
        cards: getNullCards(),
        energy: 3,
        isBasicLoaded: false,
        isDeluxeLoaded: false,
        roomsPassed: 0,
        nextNpcCommands: [], // set later
        cardsPlayedThisRoom: [],
        queue: [],
    }
    return bs
}
