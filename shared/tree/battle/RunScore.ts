export type RunScore = {
    totalScore: number
    currModifier: number
    attributes: RunScoreAttribute[]
}

export type RunScoreAttribute = {
    keyword: RunScoreAttributeName
    quantity: number
}

export type RunScoreAttributeName = 'grind' | 'grunts' | 'boss'

type RunScoreAttributeMeta = {
    description: string
    pointValue: number // eg. the number of points that 1 single "quantity" in RunScoreAttribute is worth
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
