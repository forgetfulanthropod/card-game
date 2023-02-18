import { srandInt } from '@/util'
import {
    DungeonRoomMaps,
    RoomArchetype,
    RoomCategoryId,
    RoomEnemies,
} from 'shared'
import { keys, vals } from 'shared/code'
import { eventSceneMap } from '../eventSceneMap'

const config = { randomDungeon: false }

const eventEnemies: RoomEnemies[] = [
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
            id: 'matchaGelatinCube',
            level: 6,
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
    [
        {
            id: 'warhogRaider',
            level: 3,
        },
        {
            id: 'plaguehog',
            level: 3,
        },
        {
            id: 'groghog',
            level: 3,
        },
    ],
    [
        {
            id: 'skeletonWarrior',
            level: 4,
        },
        {
            id: 'orcWarrior',
            level: 4,
        },
    ],
]

const roomOptions: Record<
    RoomCategoryId,
    RoomEnemies[] | { enemies: RoomEnemies; event: Event }[]
> = {
    events: vals(eventSceneMap).map((event, index) => ({
        enemies: eventEnemies[index % eventEnemies.length]!,
        event,
    })),
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
                level: 1,
            },
            {
                id: 'mimic',
                level: 4,
            },
            {
                id: 'bosshogJurgen',
                level: 'default',
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
    tierFour: [
        [
            {
                id: 'gnomeProspector',
                level: 4,
            },
            {
                id: 'warhogRaider',
                level: 4,
            },
            {
                id: 'plaguehog',
                level: 4,
            },
        ],
        [
            {
                id: 'groghog',
                level: 6,
            },
            {
                id: 'warhogRaider',
                level: 6,
            },
        ],
        [
            {
                id: 'plaguehog',
                level: 4,
            },
            {
                id: 'warhogRaider',
                level: 4,
            },
            {
                id: 'groghog',
                level: 4,
            },
        ],
        [
            {
                id: 'gnomeProspector',
                level: 5,
            },
            {
                id: 'gnomeProspector',
                level: 4,
            },
            {
                id: 'gnomeBigBomber',
                level: 3,
            },
        ],
        [
            {
                id: 'skeletonWarrior',
                level: 5,
            },
            {
                id: 'gnomeProspector',
                level: 4,
            },
            {
                id: 'groghog',
                level: 3,
            },
        ],
    ],
    restSite: [
        [
            {
                id: 'REST_SITE',
                level: 1,
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
                enemies: [],
                category: 'tierOne',
                edges: ['1_3', '', '2_0', ''],
            },
            '1_3': {
                uid: '1_3',
                enemies: [],
                category: 'tierOne',
                edges: ['1_5', '2_4', '', ''],
            },
            '1_5': {
                uid: '1_5',
                enemies: [],
                category: 'events',
                edges: ['1_7', '', '', ''],
            },
            '1_7': {
                uid: '1_7',
                enemies: [],
                category: 'tierTwo',
                edges: ['', '2_8', '', ''],
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
                edges: ['', '3_5', '', ''],
            },
            '2_8': {
                uid: '2_8',
                enemies: [],
                category: 'tierTwo',
                edges: ['', '', '3_7', ''],
            },
            '3_1': {
                uid: '3_1',
                enemies: [],
                category: 'events',
                edges: ['', '4_2', '', ''],
            },
            '3_5': {
                uid: '3_5',
                enemies: [],
                category: 'tierTwo',
                edges: ['3_7', '4_6', '', ''],
            },
            '3_7': {
                uid: '3_7',
                enemies: [],
                category: 'events',
                edges: ['', '4_8', '', ''],
            },
            '4_2': {
                uid: '4_2',
                enemies: [],
                category: 'tierTwo',
                edges: ['4_4', '', '', ''],
            },
            '4_4': {
                uid: '4_4',
                enemies: [],
                category: 'tierTwo',
                edges: ['4_6', '', '', ''],
            },
            '4_6': {
                uid: '4_6',
                enemies: [],
                category: 'events',
                edges: ['4_8', '', '', ''],
            },
            '4_8': {
                uid: '4_8',
                enemies: [
                    {
                        id: 'mimic',
                        level: 5,
                        // boss: true
                    },
                ],
                category: 'bosses',
                edges: ['4_10', '5_9', '', ''],
            },
            '4_10': {
                uid: '4_10',
                enemies: [],
                category: 'tierTwo',
                edges: ['4_12', '', '', ''],
            },
            '4_12': {
                uid: '4_12',
                enemies: [],
                category: 'tierTwo',
                edges: ['', '5_13', '', ''],
            },
            '5_9': {
                uid: '5_9',
                enemies: [],
                category: 'tierTwo',
                edges: ['', '6_10', '6_8', ''],
            },
            '5_13': {
                uid: '5_13',
                enemies: [],
                category: 'events',
                edges: ['', '6_14', '', ''],
            },
            '6_8': {
                uid: '6_8',
                enemies: [],
                category: 'tierThree',
                edges: ['', '', '7_7', ''],
            },
            '6_10': {
                uid: '6_10',
                enemies: [],
                category: 'events',
                edges: ['', '7_11', '', ''],
            },
            '6_14': {
                uid: '6_14',
                enemies: [],
                category: 'tierTwo',
                edges: ['', '', '7_13', ''],
            },
            '7_7': {
                uid: '7_7',
                enemies: [],
                category: 'restSite',
                edges: ['', '8_8', '', ''],
            },
            '7_11': {
                uid: '7_11',
                enemies: [],
                category: 'tierThree',
                edges: ['7_13', '', '', ''],
            },
            '7_13': {
                uid: '7_13',
                enemies: [],
                category: 'tierThree',
                edges: ['', '8_14', '', ''],
            },
            '8_8': {
                uid: '8_8',
                enemies: [],
                category: 'tierThree',
                edges: ['', '9_9', '', ''],
            },
            // '8_10': {
            //     uid: '8_10',
            //     enemies: [],
            //     category: 'tierThree',
            //     edges: ['', '9_11', '', ''],
            // },
            '8_14': {
                uid: '8_14',
                enemies: [],
                category: 'tierFour',
                edges: ['', '9_15', '', ''],
            },
            '9_9': {
                uid: '9_9',
                enemies: [],
                category: 'tierThree',
                edges: ['9_11', '', '', ''],
            },
            '9_11': {
                uid: '9_11',
                enemies: [],
                category: 'tierThree',
                edges: ['9_13', '', '', ''],
            },
            '9_13': {
                uid: '9_13',
                enemies: [],
                category: 'tierFour',
                edges: ['9_15', '', '', ''],
            },
            '9_15': {
                uid: '9_15',
                enemies: [],
                category: 'restSite',
                edges: ['9_17', '', '', ''],
            },
            '9_17': {
                uid: '9_17',
                enemies: [
                    {
                        id: 'bosshogJurgen',
                        level: 'default',
                        boss: true,
                    },
                ],
                category: 'bosses',
                edges: ['', '', '', ''],
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
        tierFour: [],
        restSite: [],
        bosses: [],
    }

    keys(roomSkeletons).forEach(roomSkeletonKey => {
        keys(roomSkeletons[roomSkeletonKey]).forEach(roomUid => {
            const room = roomSkeletons[roomSkeletonKey][roomUid]

            if (room.category == null || room.enemies.length) return
            const takenRoomIndicesOfCategory =
                takenRoomIndicesByCategory[room.category]

            Object.assign(
                room,
                randomRoomOfCategory(room.category, takenRoomIndicesOfCategory)
            )
        })
    })

    return roomSkeletons
}

function randomRoomOfCategory(
    category: keyof typeof roomOptions,
    takenRoomIndicesOfCategory: number[]
): RoomArchetype {
    const roomsOfCategory = roomOptions[category]
    const randomRoomIndex = srandInt(0, roomsOfCategory.length)

    if (
        takenRoomIndicesOfCategory.includes(randomRoomIndex) &&
        takenRoomIndicesOfCategory.length < roomsOfCategory.length
    )
        return randomRoomOfCategory(category, takenRoomIndicesOfCategory)

    takenRoomIndicesOfCategory.push(randomRoomIndex)

    const room = roomsOfCategory[randomRoomIndex]

    //@ts-expect-error
    if (!room.enemies) return { enemies: room as RoomEnemies }

    return room as RoomArchetype
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
