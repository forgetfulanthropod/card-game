import type { Card, CharacterUid, BattleCursor } from 'shared'
import { miscTauntValues } from 'shared/code'
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
    if (card.type == 'attack') {
        scene.apply(
            ['allCharacters', card.characterUid, 'taunt'],
            t => t + miscTauntValues['playAttack']
        )
    }

    scene.apply('cardsPlayedThisRoom', cards => [
        ...cards,
        {
            ...card,
            turnCount: scene.get('turnCount'),
            timestamp: new Date().toISOString(),
        },
    ])

    scene.apply('cardsPlayedThisTurn', cards => [
        ...cards,
        {
            uid: card.uid,
            characterUid: card.characterUid,
            turnCount: scene.get('turnCount'),
            timestamp: new Date().toISOString(),
        },
    ])
    // TODO: put check here or end turn end room?
    /*checkServerScoringEvent('CARDS_OVER_THRESHOLD', scene)
    checkServerScoringEvent('CARDS_WHOLE_PARTY', scene)*/
}
