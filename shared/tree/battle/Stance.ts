import type { StanceId } from './Characters'

export type StanceMultiplier = 0.75 | 1 | 1.25
/** TODO: is this still the right shape? */
export type StanceStats = {
    id: StanceId
    attackMultiplier: StanceMultiplier
    defenseMultiplier: StanceMultiplier
    targetLikelihood: 0 | 1 | 2
}
