import type { Card, CharacterUid } from '@shared'

import { interpretActions } from '@/gameState/battle/cards/interpretActions'
import type { BattleCursor } from '@shared'

export function play({
    card,
    targetUids,
    scene,
}: {
    card: Card
    targetUids: CharacterUid[]
    scene: BattleCursor
}): void {
    scene.apply('energy', energy => energy - card.energy)

    interpretActions({ card, targetUids, scene })
}
