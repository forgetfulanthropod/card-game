import type { RunScore } from 'shared'

export function getInitialRunScore(): RunScore {
    return {
        totalScore: 0,
        currModifier: 1,
        attributes: {
            enemiesKilled: 0,
            roomsCleared: 0,
            bossesKilled: 0,
            perfectKills: 0,
            roomsExitedFullHealth: 0,
            bossRoomsExitedFullHealth: 0,
            bossRoomsExitedLowDamage: 0,
            highestDamageHit: 0,
            winsNoEnergyUsedLastTurn: 0,
            survivingKaiju: 0,
            finalUserHealthRemaining: 0,
            hitsOverVulgarThreshold: 0,
            roomsWonZeroDamage: 0,
            blocksOverThreshold: 0,
            cardsPlayedOverThreshold: 0,
            null: 0,
        },
    }
}
