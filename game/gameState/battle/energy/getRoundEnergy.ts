import type { BattleCursor } from 'shared'

const BASE_ENERGY = 3
const TURNS_PER_INCREASE = 3
const MAX_ROUND_ENERGY = 5

export function setRoundEnergy(scene: BattleCursor): void {
    const incrementalEnergy =
        BASE_ENERGY - 1 + Math.ceil(scene.get('turnCount') / TURNS_PER_INCREASE)
    const roundEnergy = Math.min(incrementalEnergy, MAX_ROUND_ENERGY)
    scene.set('energy', roundEnergy)
}
