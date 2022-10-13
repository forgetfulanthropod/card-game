import {
    BattleCursor,
    RunScore,
    RunScoreAttributeName,
    RUN_SCORE_EVENT_MAPPING,
    RUN_SCORE_EVENT_META,
} from 'shared'
import { keys } from 'shared/code'

export function calculateNewRunScore(scene: BattleCursor): number {
    const { attributes, currModifier } = scene.get('runScore')
    let newTotalScore = 0

    keys(attributes).forEach(attributeName => {
        const matchingEvent = RUN_SCORE_EVENT_MAPPING[attributeName]
        const { pointValue } = RUN_SCORE_EVENT_META[matchingEvent]
        newTotalScore += attributes[attributeName] * pointValue
    })

    scene.get('lootClaimed').forEach(loot => {
            newTotalScore += loot.count
    })

    return newTotalScore * currModifier
}
