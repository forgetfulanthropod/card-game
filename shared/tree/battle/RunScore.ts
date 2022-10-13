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
    | 'roomsCleared'
    | 'bossesKilled'
    | 'roomsExitedFullHealth'
    | 'bossRoomsExitedFullHealth'

export type RunScoreAttributeMeta = {
    description: string
    pointValue: number // eg. the number of points that 1 single "count" in RunScoreAttribute is worth
    notificationText: string
    attributeName: RunScoreAttributeName
    asset?: string
}

const notifiableEvent = ['ENEMY_KILLED', 'ROOM_CLEARED', 'BOSS_KILLED'] as const
export type NotifiableEvent = typeof notifiableEvent[number]

export type RunScoreEvent =
    | NotifiableEvent
    | 'EXIT_ROOM_FULL_HEALTH'
    | 'EXIT_BOSS_FULL_HEALTH'

export const RUN_SCORE_EVENT_MAPPING: Record<
    RunScoreAttributeName,
    RunScoreEvent
> = {
    enemiesKilled: 'ENEMY_KILLED',
    roomsCleared: 'ROOM_CLEARED',
    bossesKilled: 'BOSS_KILLED',
    roomsExitedFullHealth: 'EXIT_ROOM_FULL_HEALTH',
    bossRoomsExitedFullHealth: 'EXIT_BOSS_FULL_HEALTH',
}

export const RUN_SCORE_EVENT_META: Record<
    RunScoreEvent,
    RunScoreAttributeMeta
> = {
    ENEMY_KILLED: {
        description: 'Number of enemies defeated',
        pointValue: 5,
        notificationText: '@unused',
        attributeName: 'enemiesKilled',
    },
    EXIT_ROOM_FULL_HEALTH: {
        description:
            'Number of normal battles completed with full party health',
        pointValue: 15,
        notificationText: 'Party in full health',
        attributeName: 'roomsExitedFullHealth',
    },
    EXIT_BOSS_FULL_HEALTH: {
        description: 'Number of boss battles completed with full party health',
        pointValue: 30,
        notificationText: 'Party in full health',
        attributeName: 'bossRoomsExitedFullHealth',
    },
    BOSS_KILLED: {
        description: 'Number of bosses defeated',
        pointValue: 10,
        notificationText: '@unused',
        attributeName: 'bossesKilled',
    },
    ROOM_CLEARED: {
        description: 'Number of rooms cleared',
        pointValue: 10,
        notificationText: '@unused',
        attributeName: 'roomsCleared',
    },
}

export const isNotifiableEvent = (event: any): event is NotifiableEvent =>
    notifiableEvent.includes(event)
