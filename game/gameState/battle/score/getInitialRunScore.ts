import type { RunScore } from 'shared'

export function getInitialRunScore(): RunScore {
    return {
        totalScore: 0,
        currModifier: 1,
        attributes: {
            enemiesKilled: 0,
            roomsCleared: 0,
            bossesKilled: 0,
            cumulativeOverkill: 0,
            roomsExitedFullHealth: 0,
            bossRoomsExitedFullHealth: 0,
        },
    }
}
