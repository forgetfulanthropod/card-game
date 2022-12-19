import { sample, sampleSize } from 'lodash'
import type {
    DungeonRoom,
    DungeonRoomMap,
    DungeonRoomMaps,
    NonPlayerCharacterId,
    RoomCategoryId,
    RoomEnemies,
} from 'shared'
import { keys, throwNull } from 'shared/code'
import { npcStatsMapByLevel } from '@/rulebook'
import { srandInt } from '@/util'
// - Room 1:  Two level 1 Skeletons, One level 1 Matcha
// - Room 2: Two level 1 Matchas, One level 2 Skeleton
// - Room 3: Two Level 2 Skeletons, One Level 2 Matcha
// - Room 4: Boss (maybe warhog)

const config = { randomDungeon: false }

const roomOptions: Record<RoomCategoryId, RoomEnemies[]> = {
    events: [
        [
            {
                id: 'gnomeBandit',
                level: 1,
            },
            {
                id: 'orcWarrior',
                level: 3,
            },
            {
                id: 'gnomeBandit',
                level: 2,
            },
        ],
        [
            {
                id: 'skeletonWarrior',
                level: 2,
            },
            {
                id: 'matchaGelatinCube',
                level: 3,
            },
            {
                id: 'skeletonWarrior',
                level: 2,
            },
        ],
        [
            {
                id: 'matchaGelatinCube',
                level: 2,
            },
            {
                id: 'skeletonWarrior',
                level: 3,
            },
            {
                id: 'matchaGelatinCube',
                level: 1,
            },
        ],
        [
            {
                id: 'matchaGelatinCube',
                level: 2,
            },
            {
                id: 'matchaGelatinCube',
                level: 2,
            },
            {
                id: 'matchaGelatinCube',
                level: 2,
            },
        ],
        [
            {
                id: 'orcWarrior',
                level: 2,
            },
            {
                id: 'gnomeProspector',
                level: 3,
            },
            {
                id: 'orcWarrior',
                level: 2,
            },
        ],
        [
            {
                id: 'skeletonWarrior',
                level: 8,
            },
        ],
    ],
    tierOne: [
        [
            {
                id: 'gnomeBandit',
                level: 1,
            },
            {
                id: 'warhogRaider',
                level: 2,
            },
            {
                id: 'gnomeBandit',
                level: 1,
            },
        ],
        [
            {
                id: 'gnomeBandit',
                level: 1,
            },
            {
                id: 'gnomeBigBomber',
                level: 2,
            },
            {
                id: 'gnomeBandit',
                level: 1,
            },
        ],
        [
            {
                id: 'gnomeProspector',
                level: 2,
            },
            {
                id: 'gnomeProspector',
                level: 2,
            },
        ],
        [
            {
                id: 'plaguehog',
                level: 2,
            },
            {
                id: 'gnomeProspector',
                level: 2,
            },
        ],
        [
            {
                id: 'warhogRaider',
                level: 4,
            },
        ],
        [
            {
                id: 'gnomeBigBomber',
                level: 4,
            },
        ],
    ],
    tierTwo: [
        [
            {
                id: 'groghog',
                level: 2,
            },
            {
                id: 'gnomeProspector',
                level: 3,
            },
            {
                id: 'groghog',
                level: 2,
            },
        ],
        [
            {
                id: 'gnomeProspector',
                level: 2,
            },
            {
                id: 'groghog',
                level: 2,
            },
            {
                id: 'gnomeBigBomber',
                level: 3,
            },
        ],
        [
            {
                id: 'gnomeBandit',
                level: 2,
            },
            {
                id: 'plaguehog',
                level: 3,
            },
            {
                id: 'gnomeBandit',
                level: 2,
            },
        ],
        [
            {
                id: 'gnomeProspector',
                level: 3,
            },
            {
                id: 'groghog',
                level: 2,
            },
            {
                id: 'warhogRaider',
                level: 2,
            },
        ],
        [
            {
                id: 'gnomeBigBomber',
                level: 2,
            },
            {
                id: 'gnomeBigBomber',
                level: 2,
            },
            {
                id: 'gnomeBigBomber',
                level: 3,
            },
        ],
    ],
    tierThree: [
        [
            {
                id: 'gnomeBigBomber',
                level: 3,
            },
            {
                id: 'plaguehog',
                level: 3,
            },
            {
                id: 'warhogRaider',
                level: 3,
            },
        ],
        [
            {
                id: 'plaguehog',
                level: 9,
            },
        ],
        [
            {
                id: 'gnomeBandit',
                level: 3,
            },
            {
                id: 'groghog',
                level: 3,
            },
            {
                id: 'gnomeBandit',
                level: 3,
            },
        ],
        [
            {
                id: 'gnomeBandit',
                level: 9,
            },
        ],
    ],
    bosses: [
        [
            {
                id: 'bosshogJurgen',
                level: 9,
            },
        ],
    ],
}

export function getDungeonRooms(): DungeonRoomMaps {
    const roomSkeletons: DungeonRoomMaps = {
        'Skelepit Dungeon': {},
        'Hooligans Bluff': {
            root: {
                uid: 'root',
                enemies: [],
                edges: ['', '1_1', '', ''],
            },
            '1_1': {
                uid: '1_1',
                enemies: [
                    // {
                    //     id: 'plaguehog',
                    //     level: 1,
                    // },
                    // {
                    //     id: 'warhogRaider',
                    //     level: 1,
                    // },
                    // {
                    //     id: 'groghog',
                    //     level: 1,
                    // },
                    // {
                    //     id: 'gnomeBigBomber',
                    //     level: 1,
                    // },
                    // {
                    //     id: 'gnomeProspector',
                    //     level: 1,
                    // },
                    // {
                    //     id: 'gnomeBandit',
                    //     level: 1,
                    // },
                ],
                category: 'tierOne',
                // category: 'tierOne',
                edges: ['1_3', '', '2_0', ''],
            },
            '1_3': {
                uid: '1_3',
                enemies: [],
                category: 'tierThree',
                edges: ['', '2_4', '', ''],
            },
            '2_0': {
                uid: '2_0',
                enemies: [],
                category: 'events',
                edges: ['', '3_1', '', ''],
            },
            '2_4': {
                uid: '2_4',
                enemies: [],
                category: 'tierOne',
                edges: ['2_6', '', '3_3', ''],
            },
            '2_6': {
                uid: '2_6',
                enemies: [],
                category: 'tierTwo',
                edges: ['', '3_7', '', ''],
            },
            '3_1': {
                uid: '3_1',
                enemies: [],
                category: 'tierOne',
                edges: ['3_3', '', '4_0', ''],
            },
            '3_3': {
                uid: '3_3',
                enemies: [],
                category: 'events',
                edges: ['', '4_4', '', ''],
            },
            '3_7': {
                uid: '3_7',
                enemies: [],
                category: 'tierTwo',
                edges: ['', '', '4_8', ''],
            },
            '4_0': {
                uid: '4_0',
                enemies: [],
                category: 'tierTwo',
                edges: ['', '5_1', '', ''],
            },
            '4_4': {
                uid: '4_4',
                enemies: [],
                category: 'tierThree',
                edges: ['4_8', '', '5_3', ''],
            },
            '4_8': {
                uid: '4_8',
                enemies: [],
                category: 'events',
                edges: ['', '5_7', '', ''],
            },
            '5_1': {
                uid: '5_1',
                enemies: [],
                category: 'tierTwo',
                edges: ['5_3', '', '', ''],
            },
            '5_3': {
                uid: '5_3',
                enemies: [],
                category: 'events',
                edges: ['', '6_4', '', ''],
            },
            '5_7': {
                uid: '5_7',
                enemies: [],
                category: 'tierThree',
                edges: ['', '', '6_6', ''],
            },
            '6_4': {
                uid: '6_4',
                enemies: [],
                category: 'tierThree',
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
                        id: 'bosshogJurgen',
                        level: 'default',
                        boss: true,
                    },
                ],
                category: 'bosses',
                edges: ['', '', '6-b', ''],
            },
        },
        'Fort Skeleton': {},
        'The Ninth Trash Hole of Hell': {},
        'The Matcha Caves': {},
    }

    return fillRooms(roomSkeletons)
}

function fillRooms(roomSkeletons: DungeonRoomMaps): DungeonRoomMaps {
    const takenRoomIndicesByCategory: Record<RoomCategoryId, number[]> = {
        events: [],
        tierOne: [],
        tierTwo: [],
        tierThree: [],
        bosses: [],
    }

    keys(roomSkeletons).forEach(roomSkeletonKey => {
        keys(roomSkeletons[roomSkeletonKey]).forEach(roomUid => {
            const room = roomSkeletons[roomSkeletonKey][roomUid]

            if (room.category == null || room.enemies.length) return
            const takenRoomIndicesOfCategory =
                takenRoomIndicesByCategory[room.category]

            room.enemies = randomRoomOfCategory(
                room.category,
                takenRoomIndicesOfCategory
            )
        })
    })

    return roomSkeletons
}

function randomRoomOfCategory(
    category: keyof typeof roomOptions,
    takenRoomIndicesOfCategory: number[]
): RoomEnemies {
    const roomsOfCategory = roomOptions[category]
    const randomRoomIndex = srandInt(0, roomsOfCategory.length)

    if (
        takenRoomIndicesOfCategory.includes(randomRoomIndex) &&
        takenRoomIndicesOfCategory.length < roomsOfCategory.length
    )
        return randomRoomOfCategory(category, takenRoomIndicesOfCategory)

    takenRoomIndicesOfCategory.push(randomRoomIndex)

    return roomsOfCategory[randomRoomIndex]
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
