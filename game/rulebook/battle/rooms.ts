import type { DungeonRoomMap } from 'shared'

const dummyRoom = [
    { name: 'skeletonWarrior', level: 1 },
    { name: 'skeletonWarrior', level: 1 },
    { name: 'skeletonWarrior', level: 1 },
] as const
export const dungeonRooms: DungeonRoomMap = {
    'Skelepit Dungeon': [dummyRoom],
    'Hooligan’s Bluff': [dummyRoom],
    'Fort Skeleton': [dummyRoom],
    'The Ninth Trash Hole of Hell': [dummyRoom],
    'The Matcha Caves': [dummyRoom, dummyRoom],
}
