import type { DungeonRoomMap } from 'shared'

// - Room 1:  Two level 1 Skeletons, One level 1 Matcha
// - Room 2: Two level 1 Matchas, One level 2 Skeleton
// - Room 3: Two Level 2 Skeletons, One Level 2 Matcha
// - Room 4: Boss (maybe warhog)

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
