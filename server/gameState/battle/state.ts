import type {
    BattleScene,
    DungeonName,
    OwnedCharacter,
} from '@shared'

import { makeCharacters } from './characterManagement'


export function makeBattleState(args?: { chosen?: OwnedCharacter[], dungeonName?: DungeonName }): BattleScene {
    const allCharacters = makeCharacters(args?.chosen)

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
    return Object.freeze({
        name: 'battle',
        dungeonName: args?.dungeonName ?? 'The Matcha Caves',
        turnCount: 0,
        state: 'not started',
        isPlayerTurn: srandom() < .5,
        battleHasBegun: true,
        allCharacters,
        selectedCharacter: selectedCharacter.uid,
        selectedMove,
        isBasicLoaded: false,
        isDeluxeLoaded: false,
        doors: { options: [], descriptions: [] },
        roomsPassed: 0,
    })
}
