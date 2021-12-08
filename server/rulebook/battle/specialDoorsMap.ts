import type { CharacterName } from '@shared'

// export const specialDoorNames = ['bigScary', 'candyBaby', 'normal', 'matcha', 'skeleton', 'rareItem', 'bossDoor', 'face', 'tiny', 'jumbo', 'randomEvent', 'campfire',]
export type SpecialDoorName = keyof typeof specialDoorsMap

/* interface SpecialDoor<T = Record<string, unknown>> {
    name: SpecialDoorName
    description: string
    variables: T
} */

export const specialDoorsMap = {
    bigScary: {
        name: 'bigScary',
        description: 'additional x2 dungeon modifier',
        variables: {
            modifier: 2,
        },
    },
    candyBaby: {
        name: 'candyBaby',
        description: 'generates a room equal to three rooms back, with equally scaled loot modifier',
        variables: { special: true },
    },
    normal: {
        name: 'normal',
        description: 'always takes up 1 door slot. does A-B-C system based on level',
        variables: {},
    },
    matcha: {
        name: 'matcha',
        description:
            'will automatically spawn all matcha if given a choice between randomly generating matcha with 50/50 variables.if this level is level 6, spawn a level 10 matcha cube',
        variables: {
            levelToAppearOn: 6,
            enemyName: 'matchaGelatinCube' as CharacterName,
            enemyLevel: 2,
        },
    },
    skeleton: {
        name: 'skeleton',
        description: 'same as matcha door but for skeletons',
        variables: {
            levelToAppearOn: 6,
            enemyName: 'skeletonWarrior' as CharacterName,
            enemyLevel: 10,
        },
    },
    rareItem: {
        name: 'rareItem',
        description:
            'we should figure out the specifics of what this should be in conjunction with crafting, but it’d be fun to have a door that has an especially difficult material or crafting item',
        variables: {
            possibleItems: ['fishstick', 'potion', 'swordShield', 'bread'],
        },
    },
    bossDoor: {
        name: 'bossDoor',
        description: 'has the boss',
        variables: {},
    },
    face: {
        name: 'face',
        description:
            "with a specific character’s face on it that lets you fight them as a boss. generate this character at level 1. for each difficult modifier, randomly increase the character's health by +7 or give them +1 attack",
        variables: {
            initialLevel: 1,
            healthIncrease: 7,
            attackIncrease: 1,
        },
    },
    tiny: {
        name: 'tiny',
        description: 'applies dungeon level modifier to generate more characters for all enemies',
        variables: {
            tinyPerEnemy: 2,
        },
    },
    jumbo: {
        name: 'jumbo',
        description: 'makes the character with the highest level in this dungeon room jumbo',
        variables: {
            criteria: 'highest' as 'highest' | 'all' | 'random',
        },
    },
    randomEvent: {
        name: 'randomEvent',
        description: 'question mark door',
        variables: {},
    },
    campfire: {
        name: 'campfire',
        description:
            'heals all characters for either a flat value or % of health, not sure what a good number would be yet. probably either 10% or +14',
        variables: {
            effectType: 'absolute' as 'absolute' | 'proportional',
            absoluteIncrease: 14,
            proportionalIncrease: 10,
        },
    },
}
