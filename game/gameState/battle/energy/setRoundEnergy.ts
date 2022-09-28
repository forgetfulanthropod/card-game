import type { BattleCursor } from 'shared'

/**
 * when turn count is 1, that's your first turn, 3 energy
 * on your 4th turn, you get 4 energy
 * on your 6th+ turn, you get 5 energy
 */
export function setRoundEnergy(scene: BattleCursor): void {
    const turnCount = scene.get('turnCount')

    let energy = 3

    if (turnCount > 3) {
        energy += 1
    }

    if (turnCount > 6) {
        energy += 1
    }

    scene.set('energy', energy)
    scene.set('roundEnergy', energy)
}
