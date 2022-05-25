import type { StanceName } from '@'

export type StanceMultiplier = 0.75 | 1 | 1.25
/** TODO: is this still the right shape? */
export type StanceStats = {
    name: StanceName
    attackMultiplier: StanceMultiplier
    defenseMultiplier: StanceMultiplier
    targetLikelihood: 0 | 1 | 2
}
