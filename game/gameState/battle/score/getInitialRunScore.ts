import type { RunScore } from 'shared'

export function getInitialRunScore(): RunScore {
    return {
        totalScore: 0,
        currModifier: 1,
        attributes: {
            grind: 0,
            grunts: 0,
            boss: 0,
        },
    }
}
