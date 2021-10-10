import { deepFreeze } from 'util'

export const stanceTypeMetaMap: Record<StanceType, StanceTypeMeta> = deepFreeze({
    defensive: {
        id: 'defensive',
        attackMultiplier: .75,
        defenseMultiplier: .75,
        targetLikelihood: 0
    },
    neutral: {
        id: 'neutral',
        attackMultiplier: 1,
        defenseMultiplier: 1,
        targetLikelihood: 1
    },
    aggressive: {
        id: 'aggressive',
        attackMultiplier: 1.25,
        defenseMultiplier: 1.25,
        targetLikelihood: 2
    },
})
