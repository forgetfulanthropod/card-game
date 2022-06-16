import { sample, sampleSize } from 'lodash'
import type { DungeonRoom, DungeonRoomMap, EnemyCharacterName } from 'shared'
import { throwNull } from 'shared/code'
import { enemies } from '@/rulebook'
// - Room 1:  Two level 1 Skeletons, One level 1 Matcha
// - Room 2: Two level 1 Matchas, One level 2 Skeleton
// - Room 3: Two Level 2 Skeletons, One Level 2 Matcha
// - Room 4: Boss (maybe warhog)

const config = { randomDungeon: false }

export const dungeonRooms: DungeonRoomMap = {
    'Skelepit Dungeon': [
        [
            { name: 'skeletonWarrior', level: 1 },
            { name: 'skeletonWarrior', level: 1 },
            { name: 'matchaGelatinCube', level: 1 },
        ],
        [
            { name: 'matchaGelatinCube', level: 1 },
            { name: 'skeletonWarrior', level: 2 },
            { name: 'matchaGelatinCube', level: 1 },
        ],
        [
            { name: 'skeletonWarrior', level: 2 },
            { name: 'matchaGelatinCube', level: 2 },
            { name: 'skeletonWarrior', level: 2 },
        ],
    ],
    'Hooligan’s Bluff': [],
    'Fort Skeleton': [],
    'The Ninth Trash Hole of Hell': [],
    'The Matcha Caves': [],
}

if (config.randomDungeon)
    setTimeout(() => (dungeonRooms['Skelepit Dungeon'] = randomDungeon()), 0)
function randomDungeon(): DungeonRoom[] {
    return Array.from({ length: 3 }, randomRoom)
}
function randomRoom(): DungeonRoom {
    const names = sampleSize(Object.keys(enemies), 3) as EnemyCharacterName[]
    return names.map(name => ({
        name,
        level: sample(Object.keys(enemies[name])) ?? throwNull('enemy sample'),
    }))
}
