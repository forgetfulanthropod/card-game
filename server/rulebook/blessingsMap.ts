import type { Blessing, BlessingName } from '@shared'

export const blessingsMap: Record<BlessingName, Blessing> = {
    'strongPcs': {
        name: 'strongPcs',
        effects: [
            {
                target: 'party',
                healthMultiplicand: 2,
                healthAddend: 0,
                damageMultiplicand: 2,
                damageAddend: 0,
            },
        ],
    },
    'strongEnemies': {
        name: 'strongEnemies',
        effects: [
            {
                target: 'enemies',
                healthMultiplicand: 2,
                damageMultiplicand: 2,
            },
        ],
    },
    'weakEnemies': {
        name: 'weakEnemies',
        // effect: 'double your turns',
        effects: [
            {
                target: 'enemies',
                healthMultiplicand: .5,
                damageMultiplicand: .5,
            },
        ],
    },
    'weakPcs': {
        name: 'weakPcs',
        // effect: 'double your turns',
        effects: [
            {
                target: 'enemies',
                healthMultiplicand: .5,
                damageMultiplicand: .5,
            },
        ],
    },
    'ptbotflax': {
        name: 'ptbotflax',
        displayName: 'Play The Bones of The Fallen Like a Xylophone',
        after: { doorType: 'skeleton' },
        effects: [
            {
                target: 'party',
                healthAddend: 10,
            },
            {
                target: {
                    type: 'enemies',
                    characterType: 'skeletonWarrior',
                },
                damageAddend: 1,
                // variables: {'DOT': 'first','SPL': 'alwaysOne'}
            },
        ],
    },
}
