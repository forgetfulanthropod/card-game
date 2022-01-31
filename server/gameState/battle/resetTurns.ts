import type { BattleCursor } from '@/util'

export function resetTurns(scene: BattleCursor): void {
    scene.set('turnCount', 1)
}
