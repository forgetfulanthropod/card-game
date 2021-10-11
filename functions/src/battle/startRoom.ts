import { getFromGameState, setInGameState } from '../dbwrap'
export default function startRoom(dungeonName: string, roomLevel: number) {
    const pcs = getFromGameState('ownedCharacters')
    const enemies = makeEnemies()
    setInGameState('currentScene',
        {
            type: 'battle',
            battleHasBegun: true,
            isNpcTurn: Math.random() < 0.5,
            turnCount: 0,
            characters: [...enemies, ...pcs],
            roomLevel: roomLevel
        })
}

function makeEnemies() {
    return []
}
