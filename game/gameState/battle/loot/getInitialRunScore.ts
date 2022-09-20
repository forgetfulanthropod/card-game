import type { RunScore } from 'shared'

/**
 * Initialize loot at zero.
 * Loot is updated by calculateLoot when battle or dungeon run is over.
 */
export function getInitialRunScore(): RunScore {
    return {
        totalScore: 0,
        currModifier: 1,
        attributes: []
    }
}
