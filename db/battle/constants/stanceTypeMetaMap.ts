// import { deepFreeze } from '@/util'
import { StanceName, StanceStats } from '../types'
export const stanceTypeMetaMap: Record<StanceName, StanceStats> = {
    defensive: {
        name: 'defensive',
        attackMultiplier: .75,
        defenseMultiplier: .75,
        targetLikelihood: 0
    },
    neutral: {
        name: 'neutral',
        attackMultiplier: 1,
        defenseMultiplier: 1,
        targetLikelihood: 1
    },
    aggressive: {
        name: 'aggressive',
        attackMultiplier: 1.25,
        defenseMultiplier: 1.25,
        targetLikelihood: 2
    },
}
