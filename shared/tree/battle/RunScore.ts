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
    | 'roomsExitedFullHealth'
    | 'bossRoomsExitedFullHealth'
export type RunScoreAttributeShortName = 'grind' | 'grunts' | 'boss'

export type RunScoreAttributeMeta = {
    description: string
    pointValue: number // eg. the number of points that 1 single "count" in RunScoreAttribute is worth
    notificationText: string
    attributeName: RunScoreAttributeName
    asset?: string
    shortName?: RunScoreAttributeShortName
}

export const RUN_SCORE_EVENT_MAPPING: Record<
    RunScoreAttributeName,
    RunScoreEvent
> = {
    enemiesKilled: 'ENEMY_KILLED',
    roomsExitedFullHealth: 'EXIT_ROOM_FULL_HEALTH',
    bossRoomsExitedFullHealth: 'EXIT_BOSS_FULL_HEALTH',
}

export const RUN_SCORE_EVENT_META: Record<
    RunScoreEvent,
    RunScoreAttributeMeta
> = {
    ENEMY_KILLED: {
        description: 'number of enemies defeated',
        pointValue: 5,
        notificationText: 'Enemy defeated',
        shortName: 'grind',
        attributeName: 'enemiesKilled',
    },
    EXIT_ROOM_FULL_HEALTH: {
        description: 'number of enemy battles exited w/full health',
        pointValue: 15,
        notificationText: 'Party in full health',
        shortName: 'grunts',
        attributeName: 'roomsExitedFullHealth',
    },
    EXIT_BOSS_FULL_HEALTH: {
        description: 'exit boss battle with full party health',
        pointValue: 30,
        notificationText: 'Party in full health',
        shortName: 'boss',
        attributeName: 'bossRoomsExitedFullHealth',
    },
}

const notifiableEvent = ['ENEMY_KILLED'] as const
export type NotifiableEvent = typeof notifiableEvent[number]

export const isNotifiableEvent = (event: any): event is NotifiableEvent =>
    notifiableEvent.includes(event)

export type RunScoreEvent =
    | NotifiableEvent
    | 'EXIT_ROOM_FULL_HEALTH'
    | 'EXIT_BOSS_FULL_HEALTH'

export const RunScoreEventMapping: Record<
    RunScoreEvent,
    RunScoreAttributeShortName
> = {
    ENEMY_KILLED: 'grind',
    EXIT_ROOM_FULL_HEALTH: 'grunts',
    EXIT_BOSS_FULL_HEALTH: 'boss',
}

export const ReverseRunScoreEventMapping: Record<
    RunScoreAttributeShortName,
    RunScoreEvent
> = {
    grind: 'ENEMY_KILLED',
    grunts: 'EXIT_ROOM_FULL_HEALTH',
    boss: 'EXIT_BOSS_FULL_HEALTH',
}
