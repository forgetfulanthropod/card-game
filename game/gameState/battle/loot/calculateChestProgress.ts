import { entries } from 'lodash'
import {
    BattleCursor,
    MAX_CHEST_LEVEL,
    TreasureChest,
    TreasureChestLevel,
    TreasureChestLevelThreshold,
} from 'shared'

export function calculateChestProgress(scene: BattleCursor): TreasureChest {
    const { level: prevLevel, state: prevChestState } =
        scene.get('treasureChest')

    if (prevChestState === 'calculated') {
        return scene.get('treasureChest')
    }

    const currRunScore = scene.get('runScore').totalScore
    const newLevel = calcNewChestLevel(currRunScore)
    const newProgressPct = calcNewProgressPct(currRunScore, newLevel)
    const upgraded = newLevel > prevLevel

    return {
        level: newLevel,
        progressPct: newProgressPct,
        state: 'calculated',
        upgraded,
    }
}

const calcNewChestLevel = (newRunScore: number): TreasureChestLevel => {
    let newLevel = 0 as TreasureChestLevel
    entries(TreasureChestLevelThreshold).forEach(([level, threshold]) => {
        if (newRunScore >= threshold) {
            newLevel = parseInt(level) as TreasureChestLevel
        }
    })
    return newLevel
}

const calcNewProgressPct = (
    runScore: number,
    level: TreasureChestLevel
): number => {
    if (level === MAX_CHEST_LEVEL) {
        return 1
    }

    const currLevelThreshold = TreasureChestLevelThreshold[level] // eg. level 1 is 200
    const nextLevelThreshold =
        TreasureChestLevelThreshold[(level + 1) as TreasureChestLevel] // eg. level 2 is 500
    const nextLevelTotalRange = nextLevelThreshold - currLevelThreshold // eg. 500 - 200 = 300
    const progressPct = (runScore - currLevelThreshold) / nextLevelTotalRange
    // eg. runscore 250, level 1 chest: (250 - 200) / 300 = 16.7% progressPct to level 2

    return progressPct
}
