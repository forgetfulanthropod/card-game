import type { NpcLevelStatsMap } from '@shared'

export const npcLevelStatsMap: NpcLevelStatsMap = {
    skeletonWarrior: {
        1: { maxHealth: 10, damage: 2 },
        2: { maxHealth: 20, damage: 4 },
        3: { maxHealth: 30, damage: 6 },
        4: { maxHealth: 40, damage: 8 },
        5: { maxHealth: 54, damage: 11 },
        6: { maxHealth: 65, damage: 13 },
        7: { maxHealth: 76, damage: 15 },
        8: { maxHealth: 87, damage: 17 },
        9: { maxHealth: 98, damage: 19 },
        10: { maxHealth: 109, damage: 21 },
    },
    matchaGelatinCube: {
        1: { maxHealth: 15, damage: 2 },
        2: { maxHealth: 25, damage: 3 },
        3: { maxHealth: 39, damage: 4 },
        4: { maxHealth: 55, damage: 5 },
        5: { maxHealth: 78, damage: 7 },
        6: { maxHealth: 92, damage: 9 },
        7: { maxHealth: 106, damage: 11 },
        8: { maxHealth: 120, damage: 14 },
        9: { maxHealth: 134, damage: 16 },
        10: { maxHealth: 148, damage: 17 },
    },
    orcWarrior: {
        1: { maxHealth: 15, damage: 3 },
        2: { maxHealth: 33, damage: 4 },
        3: { maxHealth: 50, damage: 6 },
        4: { maxHealth: 75, damage: 9 },
        5: { maxHealth: 88, damage: 12 },
        6: { maxHealth: 103, damage: 14 },
        7: { maxHealth: 118, damage: 16 },
        8: { maxHealth: 133, damage: 18 },
        9: { maxHealth: 148, damage: 20 },
        10: { maxHealth: 163, damage: 23 },
    },
    mimic: {
        1: { maxHealth: 26, damage: 3 },
        2: { maxHealth: 52, damage: 4 },
        3: { maxHealth: 78, damage: 6 },
        4: { maxHealth: 104, damage: 8 },
        5: { maxHealth: 130, damage: 12 },
        6: { maxHealth: 155, damage: 14 },
        7: { maxHealth: 180, damage: 16 },
        8: { maxHealth: 205, damage: 18 },
        9: { maxHealth: 230, damage: 20 },
        10: { maxHealth: 255, damage: 22 },
    },
}

export const levelMinMoveMap = {
    skeleton: {
        'Sword Whack': 0,
        'Rusty Poke': 2,
        'Slash': 3,
    },
    matcha: {
        'Basic Attack': 0,
        'Surprise Allergy': 2,
        'Itchy Ooze': 3,
    },
    orcWarrior: {
        'Meaty Charge': 0,
        'Slash': 4,
        'Bellow and Sing': 6,
    },
    mimic: {
        'Mimic': 0,
        'Chomp': 0,
        'Infectious Bite': 0,
    },
}
