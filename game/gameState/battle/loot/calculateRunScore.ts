import {
    BattleCursor,
    RunScore,
    RunScoreAttributeName,
    RUN_SCORE_ATTR_META,
} from 'shared'

export function calculateRunScore(scene: BattleCursor): RunScore {
    const { attributes, currModifier } = scene.get('runScore')
    let newTotalScore = 0

    attributes.forEach(attr => {
        const { pointValue } = RUN_SCORE_ATTR_META[attr.keyword]
        newTotalScore += attr.quantity * pointValue
    })

    return {
        totalScore: newTotalScore * currModifier,
        currModifier: currModifier,
        attributes: attributes,
    }
}
