import * as db from '../dbwrap'
export default function startRoom() {
    const pcs = db.getFromGameState('ownedCharacters')
    const enemies = makeEnemies()
    db.setInGameState('currentScene',
        {
            type: 'battle',
            battleHasBegun: true,
            isNpcTurn: Math.random() < 0.5,
            turnCount: 0,
            characters: [...enemies, ...pcs],
            roomLevel: 1
        })
}

function makeEnemies() {
    return []
}
