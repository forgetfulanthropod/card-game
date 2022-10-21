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
    | 'null' // used for derived and/or server side score events

export type RunScoreEventMeta = {
    description: string
    pointValue: number // eg. the number of points that 1 single "count" in RunScoreAttribute is worth
    attributeName: RunScoreAttributeName
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
    | 'NULL'

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
    null: 'NULL',
}

//TODO: Adjust point values to remove decimals
export const RUN_SCORE_EVENT_META: Record<RunScoreEvent, RunScoreEventMeta> = {
    ENEMY_KILLED: {
        description: 'Number of enemies defeated',
        pointValue: 3,
        attributeName: 'enemiesKilled',
    },
    EXIT_ROOM_FULL_HEALTH: {
        description:
            'Number of normal battles completed with full party health',
        pointValue: 6,
        attributeName: 'roomsExitedFullHealth',
    },
    EXIT_BOSS_FULL_HEALTH: {
        description: 'Number of boss battles completed with full party health',
        pointValue: 20,
        attributeName: 'bossRoomsExitedFullHealth',
    },
    EXIT_BOSS_LOW_DAMAGE: {
        description: 'Exit Boss Battle without losing more than 15 health',
        pointValue: 12,
        attributeName: 'bossRoomsExitedFullHealth',
    },
    BOSS_KILLED: {
        description: 'Number of bosses defeated',
        pointValue: 10,
        attributeName: 'bossesKilled',
    },
    ROOM_CLEARED: {
        description: 'Number of rooms cleared',
        pointValue: 10,
        attributeName: 'roomsCleared',
    },
    ROOM_WIN_NO_ENERGY_USED: {
        description: 'Won battle without spending energy in last turn',
        pointValue: 8,
        attributeName: 'winsNoEnergyUsedLastTurn',
    },
    OVERKILL: {
        description: 'Cumulative damage inflicted on top of dead enemy',
        pointValue: 0.25,
        attributeName: 'cumulativeOverkill',
    },
    PERFECT_KILL: {
        description:
            'Final hit against enemy exacly equal to its remaining health',
        pointValue: 2,
        attributeName: 'perfectKills',
    },
    HIGHEST_DAMAGE: {
        description: 'Highest damage from single hit',
        pointValue: 0.3,
        attributeName: 'highestDamageHit',
    },
    RUN_COMPLETED: {
        description:
            'Completed run (no score by itself but has derived events)',
        pointValue: 0,
        attributeName: 'null',
    },
    SURVIVING_KAIJU: {
        description: 'Number of Kaiju alive at the end of run',
        pointValue: 5,
        attributeName: 'survivingKaiju',
    },
    FINAL_USER_HEALTH_REMAINING: {
        description: 'Amount of health remaining at end of run',
        pointValue: 0.15,
        attributeName: 'finalUserHealthRemaining',
    },
    HIT_VULGAR_THRESHOLD: {
        description: 'Number of hits that dealt >55 damage in a single turn',
        pointValue: 1,
        attributeName: 'hitsOverVulgarThreshold',
    },
    ROOM_WIN_ZERO_DAMAGE: {
        description: 'Lose 0 health during a room',
        pointValue: 3,
        attributeName: 'roomsWonZeroDamage',
    },
    NULL: {
        description: 'Can be optionally used for derived events',
        pointValue: 0,
        attributeName: 'null',
    },
}

export const RUN_TIME_THRESHOLD_MINS = 15
