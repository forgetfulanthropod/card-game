import { sample, sampleSize } from 'lodash'
import type { DungeonRoom, DungeonRoomMap, EnemyCharacterId } from 'shared'
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
            { id: 'skeletonWarrior', level: 1 },
            { id: 'matchaGelatinCube', level: 1 },
            { id: 'skeletonWarrior', level: 1 },
        ],
        [
            { id: 'gnomeHooligan', level: 2 },
            { id: 'orcWarrior', level: 2 },
            { id: 'gnomeHooligan', level: 2 },
        ],
        [
            { id: 'matchaGelatinCube', level: 4 },
            { id: 'skeletonWarrior', level: 4 },
            { id: 'matchaGelatinCube', level: 4 },
        ],
        [{ id: 'warhog', level: 1 }],
        // [{ id: 'skeletonWarrior', level: 9 }],
        [{ id: 'REST_SITE', level: 1 }],
        [{ id: 'mimic', level: 10 }],
        // [{ id: 'mimic', level: 3 }],
        // [{ id: 'bosshogJurgen', level: 4 }],
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
    const ids = sampleSize(Object.keys(enemies), 3) as EnemyCharacterId[]
    return ids.map(id => ({
        id,
        level: sample(Object.keys(enemies[id])) ?? throwNull('enemy sample'),
    }))
}
