export type RunScore = {
    totalScore: number
    currModifier: number
    attributes: Record<RunScoreAttributeName, number>
}

export type RunScoreAttribute = {
    keyword: RunScoreAttributeName
    count: number
}

export type RunScoreAttributeName =
    | 'enemiesKilled'
    | 'roomsCleared' // exists as a sort of redundant data field (eg. it's also present at the top-level tree) mostly for convenience when updating and calculating score
    | 'bossesKilled'
    | 'cumulativeOverkill'
    | 'perfectKills'
    | 'roomsExitedFullHealth'
    | 'bossRoomsExitedFullHealth'
    | 'bossRoomsExitedLowDamage'
    | 'winsNoEnergyUsedLastTurn'
    | 'highestDamageHit'
    | 'hitsOverVulgarThreshold'
    | 'minsUnderRunThreshold'
    | 'survivingKaiju'
    | 'finalUserHealthRemaining'
    | 'roomsWonZeroDamage'
    | 'blocksOverThreshold'
    | 'roomsZeroStanceChanges'
    | 'stanceChangesOverThreshold'
    | 'cardsPlayedOverThreshold'
    | 'null' // used for derived and/or server side score events

export type RunScoreEventMeta = {
    description: string
    pointValue: number // eg. the number of points that 1 single "count" in RunScoreAttribute is worth
    attributeName: RunScoreAttributeName
    shortDescription: string
    asset?: string
}

export type NotifiableEvent =
    | 'ENEMY_KILLED'
    | 'ROOM_CLEARED'
    | 'BOSS_KILLED'
    | 'OVERKILL'
    | 'PERFECT_KILL'
    | 'EXIT_ROOM_FULL_HEALTH'
    | 'EXIT_BOSS_FULL_HEALTH'
    | 'EXIT_BOSS_LOW_DAMAGE'
    | 'ROOM_WIN_NO_ENERGY_USED'
    | 'ROOM_WIN_ZERO_DAMAGE'

export type NonNotifiableEvent =
    | 'HIGHEST_DAMAGE'
    | 'RUN_COMPLETED'
    | 'SURVIVING_KAIJU'
    | 'FINAL_USER_HEALTH_REMAINING'
    | 'HIT_VULGAR_THRESHOLD'
    | 'BLOCK_OVER_THRESHOLD'
    | 'NULL'
    | 'STANCE_CHANGES'
    | 'CARDS_OVER_THRESHOLD'

export type RunScoreEvent = NotifiableEvent | NonNotifiableEvent

export const RUN_SCORE_EVENT_MAPPING: Record<
    RunScoreAttributeName,
    RunScoreEvent
> = {
    enemiesKilled: 'ENEMY_KILLED',
    roomsCleared: 'ROOM_CLEARED',
    cumulativeOverkill: 'OVERKILL',
    perfectKills: 'PERFECT_KILL',
    bossesKilled: 'BOSS_KILLED',
    roomsExitedFullHealth: 'EXIT_ROOM_FULL_HEALTH',
    bossRoomsExitedFullHealth: 'EXIT_BOSS_FULL_HEALTH',
    highestDamageHit: 'HIGHEST_DAMAGE',
    hitsOverVulgarThreshold: 'HIT_VULGAR_THRESHOLD',
    minsUnderRunThreshold: 'RUN_COMPLETED',
    bossRoomsExitedLowDamage: 'EXIT_BOSS_LOW_DAMAGE',
    winsNoEnergyUsedLastTurn: 'ROOM_WIN_NO_ENERGY_USED',
    finalUserHealthRemaining: 'FINAL_USER_HEALTH_REMAINING',
    survivingKaiju: 'SURVIVING_KAIJU',
    roomsWonZeroDamage: 'ROOM_WIN_ZERO_DAMAGE',
    blocksOverThreshold: 'BLOCK_OVER_THRESHOLD',
    stanceChangesOverThreshold: 'STANCE_CHANGES',
    roomsZeroStanceChanges: 'STANCE_CHANGES',
    cardsPlayedOverThreshold: 'CARDS_OVER_THRESHOLD',
    null: 'NULL',
}

//TODO: Adjust point values to remove decimals
export const RUN_SCORE_EVENT_META: Record<RunScoreEvent, RunScoreEventMeta> = {
    ENEMY_KILLED: {
        description: 'Number of enemies defeated',
        shortDescription: 'Enemies Defeated',
        pointValue: 3,
        attributeName: 'enemiesKilled',
    },
    EXIT_ROOM_FULL_HEALTH: {
        description:
            'Number of normal battles completed with full party health',
        pointValue: 6,
        shortDescription: 'Rooms Completed with Full Health',
        attributeName: 'roomsExitedFullHealth',
    },
    EXIT_BOSS_FULL_HEALTH: {
        description: 'Number of boss battles completed with full party health',
        shortDescription: 'Boss Rooms Completed in Full Health',
        pointValue: 20,
        attributeName: 'bossRoomsExitedFullHealth',
    },
    EXIT_BOSS_LOW_DAMAGE: {
        description: 'Exit Boss Battle without losing more than 15 health',
        shortDescription: 'Boss Battles Lost <15 Health',
        pointValue: 12,
        attributeName: 'bossRoomsExitedFullHealth',
    },
    BOSS_KILLED: {
        description: 'Number of bosses defeated',
        shortDescription: 'Bosses Defeated',
        pointValue: 10,
        attributeName: 'bossesKilled',
    },
    ROOM_CLEARED: {
        description: 'Number of rooms cleared',
        shortDescription: 'Rooms Cleared',
        pointValue: 10,
        attributeName: 'roomsCleared',
    },
    ROOM_WIN_NO_ENERGY_USED: {
        description: 'Won battle without spending energy in last turn',
        shortDescription: 'Battle Won w/Idle Last Turn',
        pointValue: 8,
        attributeName: 'winsNoEnergyUsedLastTurn',
    },
    OVERKILL: {
        description: 'Cumulative damage inflicted on top of dead enemy',
        shortDescription: 'Cumulative Overkill',
        pointValue: 0.25,
        attributeName: 'cumulativeOverkill',
    },
    PERFECT_KILL: {
        description:
            'Final hit against enemy exacly equal to its remaining health',
        shortDescription: 'Perfect Kills',
        pointValue: 2,
        attributeName: 'perfectKills',
    },
    HIGHEST_DAMAGE: {
        description: 'Highest damage from single hit',
        shortDescription: 'Highest Damage From Single Hit',
        pointValue: 0.3,
        attributeName: 'highestDamageHit',
    },
    RUN_COMPLETED: {
        description:
            'Completed run (no score by itself but has derived events)',
        shortDescription: 'Completed Run Under 15 Mins',
        pointValue: 0,
        attributeName: 'null',
    },
    SURVIVING_KAIJU: {
        description: 'Number of Kaiju alive at the end of run',
        shortDescription: 'Surviving Kaiju',
        pointValue: 5,
        attributeName: 'survivingKaiju',
    },
    FINAL_USER_HEALTH_REMAINING: {
        description: 'Amount of health remaining at end of run',
        shortDescription: 'Total Health Remaining',
        pointValue: 0.15,
        attributeName: 'finalUserHealthRemaining',
    },
    HIT_VULGAR_THRESHOLD: {
        description: 'Number of hits that dealt >55 damage in a single turn',
        shortDescription: 'Hits Dealt Over 55 Damage',
        pointValue: 1,
        attributeName: 'hitsOverVulgarThreshold',
    },
    ROOM_WIN_ZERO_DAMAGE: {
        description: 'Lose 0 health during a room',
        shortDescription: 'Rooms Beat with 0 Lost Health',
        pointValue: 3,
        attributeName: 'roomsWonZeroDamage',
    },
    BLOCK_OVER_THRESHOLD: {
        description: 'Generate over 40 block in a single turn',
        shortDescription: 'Turns with Over 40 Block',
        pointValue: 1,
        attributeName: 'blocksOverThreshold',
    },
    STANCE_CHANGES: {
        description: 'Stances Changed',
        shortDescription: 'Stance Changes over 5',
        pointValue: 1, // need to fix
        attributeName: 'null',
    },
    CARDS_OVER_THRESHOLD: {
        description: 'Number of cards over 5 played in a single turn',
        shortDescription: 'Cards Over 5 Played',
        pointValue: 2,
        attributeName: 'cardsPlayedOverThreshold',
    },
    NULL: {
        description: 'Can be optionally used for derived events',
        shortDescription: 'NULL',
        pointValue: 0,
        attributeName: 'null',
    },
}

export const RUN_TIME_THRESHOLD_MINS = 15
