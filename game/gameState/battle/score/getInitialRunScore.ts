import type { RunScore } from 'shared'

export function getInitialRunScore(): RunScore {
    return {
        totalScore: 0,
        currModifier: 1,
        attributes: {
            enemiesKilled: 0,
            roomsExitedFullHealth: 0,
            bossRoomsExitedFullHealth: 0,
        },
    }
}
