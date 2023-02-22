import {
    RunScore,
    RunScoreAttributeName,
    RUN_SCORE_EVENT_MAPPING,
} from 'shared'

export function getInitialRunScore(): RunScore {
    return {
        totalScore: 0,
        currModifier: 1,
        attributes: Object.fromEntries(
            Object.keys(RUN_SCORE_EVENT_MAPPING).map(key => [key, 0])
        ) as Record<RunScoreAttributeName, number>,
    }
}

export function getRoomScoreCounter(): Record<RunScoreAttributeName, number> {
    return Object.fromEntries(
        Object.keys(RUN_SCORE_EVENT_MAPPING).map(key => [key, 0])
    ) as Record<RunScoreAttributeName, number>
}
