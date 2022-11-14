import { sample, sampleSize } from 'lodash'
import type {
    DungeonRoom,
    DungeonRoomMap,
    DungeonRoomMaps,
    EnemyCharacterId,
} from 'shared'
import { throwNull } from 'shared/code'
import { enemies } from '@/rulebook'
// - Room 1:  Two level 1 Skeletons, One level 1 Matcha
// - Room 2: Two level 1 Matchas, One level 2 Skeleton
// - Room 3: Two Level 2 Skeletons, One Level 2 Matcha
// - Room 4: Boss (maybe warhog)

const config = { randomDungeon: false }

export const dungeonRooms: DungeonRoomMaps = {
    'Skelepit Dungeon': {
        root: {
            uid: 'root',
            enemies: [],
            edges: ['', '1_1', '', ''],
        },
        '1_1': {
            uid: '1_1',
            enemies: [
                {
                    id: 'skeletonWarrior',
                    level: 1,
                },
                // {
                //     id: 'matchaGelatinCube',
                //     level: 1,
                // },
                // {
                //     id: 'skeletonWarrior',
                //     level: 1,
                // },
            ],
            edges: ['1_3', '', '2_0', ''],
        },
    },
    'Hooligan’s Bluff': {
        root: {
            uid: 'root',
            enemies: [],
            edges: ['', '1_1', '', ''],
        },
        '1_1': {
            uid: '1_1',
            enemies: [
                {
                    id: 'skeletonWarrior',
                    level: 1,
                },
                // {
                //     id: 'matchaGelatinCube',
                //     level: 1,
                // },
                // {
                //     id: 'skeletonWarrior',
                //     level: 1,
                // },
            ],
            edges: ['1_3', '', '2_0', ''],
        },
        '1_3': {
            uid: '1_3',
            enemies: [
                // {
                //     id: 'skeletonWarrior',
                //     level: 1,
                // },
                {
                    id: 'matchaGelatinCube',
                    level: 1,
                },
                // {
                //     id: 'skeletonWarrior',
                //     level: 1,
                // },
            ],
            edges: ['', '2_4', '', ''],
        },
        '2_0': {
            uid: '2_0',
            enemies: [
                {
                    id: 'orcWarrior',
                    level: 2,
                },
            ],
            edges: ['', '3_1', '', ''],
        },
        '2_4': {
            uid: '2_4',
            enemies: [
                {
                    id: 'skeletonWarrior',
                    level: 1,
                },
                {
                    id: 'skeletonWarrior',
                    level: 2,
                },
                {
                    id: 'skeletonWarrior',
                    level: 1,
                },
            ],
            edges: ['2_6', '', '3_3', ''],
        },
        '2_6': {
            uid: '2_6',
            enemies: [
                {
                    id: 'matchaGelatinCube',
                    level: 3,
                },
                {
                    id: 'skeletonWarrior',
                    level: 3,
                },
                {
                    id: 'matchaGelatinCube',
                    level: 3,
                },
            ],
            edges: ['', '3_7', '', ''],
        },
        '3_1': {
            uid: '3_1',
            enemies: [
                {
                    id: 'gnomeHooligan',
                    level: 2,
                },
                {
                    id: 'orcWarrior',
                    level: 2,
                },
                {
                    id: 'gnomeHooligan',
                    level: 2,
                },
            ],
            edges: ['3_3', '', '4_0', ''],
        },
        '3_3': {
            uid: '3_3',
            enemies: [
                {
                    id: 'gnomeHooligan',
                    level: 2,
                },
                {
                    id: 'warhog',
                    level: 1,
                },
                {
                    id: 'gnomeHooligan',
                    level: 3,
                },
            ],
            edges: ['', '4_4', '', ''],
        },
        '3_7': {
            uid: '3_7',
            enemies: [
                {
                    id: 'gnomeHooligan',
                    level: 1,
                },
                {
                    id: 'gnomeHooligan',
                    level: 2,
                },
                {
                    id: 'gnomeHooligan',
                    level: 1,
                },
            ],
            edges: ['', '', '4_8', ''],
        },
        '4_0': {
            uid: '4_0',
            enemies: [
                {
                    id: 'orcWarrior',
                    level: 3,
                },
            ],
            edges: ['', '5_1', '', ''],
        },
        '4_4': {
            uid: '4_4',
            enemies: [
                {
                    id: 'warhog',
                    level: 1,
                },
            ],
            edges: ['4_8', '', '5_3', ''],
        },
        '4_8': {
            uid: '4_8',
            enemies: [
                {
                    id: 'mimic',
                    level: 1,
                },
            ],
            edges: ['', '5_7', '', ''],
        },
        '5_1': {
            uid: '5_1',
            enemies: [
                {
                    id: 'matchaGelatinCube',
                    level: 1,
                },
            ],
            edges: ['5_3', '', '', ''],
        },
        '5_3': {
            uid: '5_3',
            enemies: [
                {
                    id: 'matchaGelatinCube',
                    level: 1,
                },
            ],
            edges: ['', '6_4', '', ''],
        },
        '5_7': {
            uid: '5_7',
            enemies: [
                {
                    id: 'matchaGelatinCube',
                    level: 1,
                },
            ],
            edges: ['', '', '6_6', ''],
        },
        '6_4': {
            uid: '6_4',
            enemies: [
                {
                    id: 'warhog',
                    level: 1,
                },
            ],
            edges: ['6_6', '', '', ''],
        },
        '6_6': {
            uid: '6_6',
            enemies: [
                {
                    id: 'REST_SITE',
                    level: 1,
                },
            ],
            edges: ['', '7_7', '', ''],
        },
        '7_7': {
            uid: '7_7',
            enemies: [
                {
                    id: 'mimic',
                    level: 10,
                    boss: true,
                },
            ],
            edges: ['', '', '6-b', ''],
        },
    },
    // 'Hooligan’s Bluff': {},
    'Fort Skeleton': {},
    'The Ninth Trash Hole of Hell': {},
    'The Matcha Caves': {},
}

// if (config.randomDungeon)
//     setTimeout(() => (dungeonRooms['Skelepit Dungeon'] = randomDungeon()), 0)
// function randomDungeon(): DungeonRoom[] {
//     return Array.from({ length: 3 }, randomRoom)
// }
// function randomRoom(): DungeonRoom {
//     const ids = sampleSize(Object.keys(enemies), 3) as EnemyCharacterId[]
//     return ids.map(id => ({
//         id,
//         level: sample(Object.keys(enemies[id])) ?? throwNull('enemy sample'),
//     }))
// }
