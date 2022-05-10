import type { BattleScene, DungeonName, OwnedCharacterStats } from '@shared'

import { getNullCards } from './cards/cardManagement'
import { makeCharacters } from './characterManagement'

export function makeBattleState(args: {
    chosen?: OwnedCharacterStats[]
    dungeonName?: DungeonName
    username: string
}): BattleScene {
    const allCharacters = makeCharacters(args?.chosen, args.username)

    // DEBUG
    // kill most of the characters
    // for (let i = 0; i < 12; i++) {
    //     if (i === 0 || i === 6) continue
    //     allCharacters[i].health = -1
    //     // allCharacters
    // }

    const selectedCharacter = Object.values(allCharacters).find(c => c.isPc)
    if (!selectedCharacter) {
        throw Error('could not find any initial player characters')
    }
    const selectedMove = selectedCharacter.moves[0]
    if (selectedCharacter == null) throw Error('no player characters!')
    // const playerStarts = srandom() < 0.5
    const playerStarts = true

    return Object.freeze({
        username: args.username,
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
        selectedCharacter: selectedCharacter.uid,
        selectedMove,
        isBasicLoaded: false,
        isDeluxeLoaded: false,
        doors: { options: [], descriptions: [] },
        roomsPassed: 0,
        selectedTargets: [],
    })
}
