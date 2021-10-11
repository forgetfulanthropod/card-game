import { CharacterState } from '../../../shared/datamodel'
import { getFromGameState, setInGameState } from '../dbwrap'
export default function startRoom(dungeonName: string, roomLevel: number) {
    const pcs = getFromGameState('ownedCharacters')
    setInGameState('currentScene',
        {
            name: 'battle',
            state: 'not started',
            isPlayerTurn: false,
            allCharacters: {},
            selectedCharacter: '123',
            selectedMove: '456',
            isBasicLoaded: true,
            isDeluxeLoaded: true,
            turnCount: 0,
        })
}

function makeEnemies() {
    return {}
}
