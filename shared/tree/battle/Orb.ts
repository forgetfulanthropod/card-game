export type OrbType = 'lightning' | 'protection' | 'frost'
export interface Orb {
    type: OrbType
    remainingCount: number
}
