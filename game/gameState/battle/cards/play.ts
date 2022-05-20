import type { Card, CharacterUid, BattleCursor } from 'shared'

import { interpretActions } from '@/gameState/battle/cards/interpretActions'

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
