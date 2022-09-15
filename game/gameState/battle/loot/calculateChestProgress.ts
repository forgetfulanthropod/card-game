import {
    BattleCursor,
    MAX_CHEST_LEVEL,
    TreasureChest,
    TreasureChestLevel,
} from 'shared'

export function calculateChestProgress(scene: BattleCursor): TreasureChest {
    const treasureChest = scene.select('treasureChest')
    const { level, progressPct } = treasureChest.get()
    const progressPctIncrement = 0.75 // TODO: change to actual calculation

    let newProgressPct = progressPct + progressPctIncrement
    let newLevel = level

    if (newProgressPct > 1 && level < MAX_CHEST_LEVEL) {
        // reaching 1 means level up, and we carry over remaining progress onto next level
        newLevel++ && newProgressPct--
    }

    return {
        level: newLevel as TreasureChestLevel,
        progressPct: newProgressPct,
        state: 'calculated',
    }
}
