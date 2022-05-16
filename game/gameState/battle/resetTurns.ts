import type { BattleCursor } from 'shared'

export function resetTurns(scene: BattleCursor): void {
    scene.set('turnCount', 1)
}
