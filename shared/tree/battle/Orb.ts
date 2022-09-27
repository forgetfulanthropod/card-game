export type OrbType = 'lightning' | 'protection' | 'frost' | 'holyLight'
export interface Orb {
    type: OrbType
    remainingCount: number
}
