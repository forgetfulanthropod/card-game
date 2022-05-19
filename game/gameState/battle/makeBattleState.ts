import type { BattleScene, DungeonName, OwnedCharacterStats } from 'shared'

import { getNullCards } from './cards/cardManagement'
import { makeCharacters } from './characterManagement'

export function makeBattleState(args: {
    chosen?: OwnedCharacterStats[]
    dungeonName?: DungeonName
    game: Gamecursor
}): BattleScene {
    const allCharacters = makeCharacters(
        args?.chosen,
        args.game.get('blessings')
    )

    // DEBUG
    // kill most of the characters
    // for (let i = 0; i < 12; i++) {
    //     if (i === 0 || i === 6) continue
    //     allCharacters[i].health = -1
    //     // allCharacters
    // }

    // const playerStarts = srandom() < 0.5
    const playerStarts = true

    return Object.freeze({
        username: args.game.get('username'),
        name: 'battle',
        dungeonName: args?.dungeonName ?? 'The Matcha Caves',
        turnCount: 1,
        state: 'not started',
        playerStarts,
        isPlayerTurn: playerStarts,
        battleHasBegun: true,
        allCharacters,
        cards: getNullCards(),
        energy: 3,
        isBasicLoaded: false,
        isDeluxeLoaded: false,
        doors: { options: [], descriptions: [] },
        roomsPassed: 0,
        nextNpcMoves: [], // set later
    })
}
