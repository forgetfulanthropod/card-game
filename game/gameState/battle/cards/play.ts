import type { Card, CharacterUid, BattleCursor } from 'shared'
import { getLivingNpcs } from '../characterGetters'
import { checkServerScoringEvent } from '../score/checkServerScoringEvent'

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

    scene.apply('cardsPlayedThisTurn', cards => [
        ...cards,
        {
            uid: card.uid,
            characterUid: card.characterUid,
            timestamp: new Date().toISOString(),
        },
    ])
    
    checkServerScoringEvent('CARDS_OVER_THRESHOLD', scene)
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
