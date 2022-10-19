import type { Card, CharacterUid, BattleCursor } from 'shared'
import { getLivingNpcs } from '../characterGetters'

import { interpretCommand } from './interpretCommand'

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

    interpretCommand({
        command: card,
        targetUids: getTargetUids({
            card,
            targetUids,
            scene,
        }),
        scene,
    })
    scene.apply('cardsPlayedThisRoom', cards => [
        ...cards,
        { ...card, timestamp: new Date().toISOString() },
    ])
}

function getTargetUids({
    card,
    targetUids,
    scene,
}: {
    card: Card
    targetUids: CharacterUid[]
    scene: BattleCursor
}) {
    if (card.targetType === 'allEnemies')
        return getLivingNpcs(scene.get()).map(npc => npc.uid)

    return targetUids
}
