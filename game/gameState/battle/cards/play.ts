import type { Card, CharacterUid, BattleCursor } from 'shared'
import { checkServerScoringEvent } from '../score/checkServerScoringEvent'
import { getTargetUids } from './getTargetUids'

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
