import {
    BattleCursor,
    RunScore,
    RunScoreAttributeName,
    RUN_SCORE_ATTR_META,
} from 'shared'
import { keys } from 'shared/code'

// Only calculate new run score at time of player death or end of room
export function calculateNewRunScore(scene: BattleCursor): RunScore {
    const { attributes, currModifier } = scene.get('runScore')
    let newTotalScore = 0

    keys(attributes).forEach(attributeName => {
        const { pointValue } = RUN_SCORE_ATTR_META[attributeName]
        newTotalScore += attributes[attributeName] * pointValue
    })

    return {
        totalScore: newTotalScore * currModifier,
        currModifier: currModifier,
        attributes: attributes,
    }
}
