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
    | 'highestDamageHit'
    | 'minsUnderRunThreshold'

export type RunScoreAttributeMeta = {
    description: string
    pointValue: number // eg. the number of points that 1 single "count" in RunScoreAttribute is worth
    attributeName: RunScoreAttributeName
    asset?: string
}

const notifiableEvent = [
    'ENEMY_KILLED',
    'ROOM_CLEARED',
    'BOSS_KILLED',
    'OVERKILL',
    'PERFECT_KILL',
    'EXIT_ROOM_FULL_HEALTH',
    'EXIT_BOSS_FULL_HEALTH',
    'EXIT_BOSS_LOW_DAMAGE',
] as const
export type NotifiableEvent = typeof notifiableEvent[number]

export type RunScoreEvent = NotifiableEvent | 'HIGHEST_DAMAGE' | 'RUN_COMPLETED'

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
    minsUnderRunThreshold: 'RUN_COMPLETED',
    bossRoomsExitedLowDamage: 'EXIT_BOSS_LOW_DAMAGE',
}

export const RUN_SCORE_EVENT_META: Record<
    RunScoreEvent,
    RunScoreAttributeMeta
> = {
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
        description: 'Completed run in under X minutes',
        pointValue: 10,
        attributeName: 'minsUnderRunThreshold',
    },
}

export const isNotifiableEvent = (event: any): event is NotifiableEvent =>
    notifiableEvent.includes(event)

export const RUN_TIME_THRESHOLD_MINS = 15
