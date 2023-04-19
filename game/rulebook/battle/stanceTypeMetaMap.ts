import type { StanceId, StanceStats } from 'shared'
export const stanceTypeMetaMap: Record<StanceId, StanceStats> = {
    avoidant: {
        id: 'avoidant',
        attackMultiplier: 1,
        defenseMultiplier: 1,
        targetLikelihood: 1,
    },
    neutral: {
        id: 'neutral',
        attackMultiplier: 1,
        defenseMultiplier: 1,
        targetLikelihood: 1,
    },
    aggressive: {
        id: 'aggressive',
        attackMultiplier: 1,
        defenseMultiplier: 1,
        targetLikelihood: 1,
    },
}
