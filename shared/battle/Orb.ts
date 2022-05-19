export type OrbType = 'lightning' | 'protection'
export interface Orb {
    type: OrbType
    remainingCount: number
}
