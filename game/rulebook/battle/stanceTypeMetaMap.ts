import type { StanceName, StanceStats } from 'shared'
export const stanceTypeMetaMap: Record<StanceName, StanceStats> = {
    defensive: {
        name: 'defensive',
        attackMultiplier: 0.75,
        defenseMultiplier: 0.75,
        targetLikelihood: 0,
    },
    neutral: {
        name: 'neutral',
        attackMultiplier: 1,
        defenseMultiplier: 1,
        targetLikelihood: 1,
    },
    aggressive: {
        name: 'aggressive',
        attackMultiplier: 1.25,
        defenseMultiplier: 1.25,
        targetLikelihood: 2,
    },
}
