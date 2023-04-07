export type OrbType =
    | 'lightning'
    | 'protection'
    | 'frost'
    | 'holyLight'
    | 'crossedFingers'
export interface Orb {
    type: OrbType
    remainingCount: number
}
