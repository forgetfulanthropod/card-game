export type RunScore = {
    totalScore: number
    currModifier: number
    attributes: Record<RunScoreAttributeName, number>
}

export type RunScoreAttribute = {
    keyword: RunScoreAttributeName
    count: number
}

export type RunScoreAttributeName = 'grind' | 'grunts' | 'boss'

type RunScoreAttributeMeta = {
    description: string
    pointValue: number // eg. the number of points that 1 single "count" in RunScoreAttribute is worth
}
export const RUN_SCORE_ATTR_META: Record<
    RunScoreAttributeName,
    RunScoreAttributeMeta
> = {
    grind: {
        description: 'number of enemies defeated',
        pointValue: 5,
    },
    grunts: {
        description: 'number of enemy battles exited w/full health',
        pointValue: 15,
    },
    boss: {
        description: 'exit boss battle with full party health',
        pointValue: 30,
    },
}

export type RunScoreEvent =
    | 'ENEMY_KILLED'
    | 'EXIT_ROOM_FULL_HEALTH'
    | 'EXIT_BOSS_FULL_HEALTH'

export const RunScoreEventMapping: Record<
    RunScoreEvent,
    RunScoreAttributeName
> = {
    ENEMY_KILLED: 'grind',
    EXIT_ROOM_FULL_HEALTH: 'grunts',
    EXIT_BOSS_FULL_HEALTH: 'boss',
}
