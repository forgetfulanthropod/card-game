import type { Card, BattleCursor, GameActions } from 'shared'

import { throwNull } from 'shared/code'
import {
    discard,
    getEnergy,
    play,
    updateHand,
    updateNpcMoves,
} from '@/gameState'
import { getBattleSceneIn } from '@/util'
import { updateCharacters } from '@/gameState/battle/characters/updateCharacters'
import { trackMetric } from 'server/metrics'
import { activateSouvenirs } from '@/gameState/battle/activateSouvenirs'

export const playCard: GameActions['playCard'] = args => {
    const scene = getBattleSceneIn(args.game)
    const card =
        scene.get('cards', 'hand', args.cardUid) ??
        throwNull(`cardUid ${args.cardUid}`)

    // logger.info(`playing card ${card.uid}`)
    if (isPlayable({ card, scene })) {
        scene.select('allCharacters', card.characterUid).set('hasMoved', true)
        // get target hp before card play for metric
        trackMetric('playCard', { card, scene, targetUids: args.targetUids })
        play({ card, targetUids: args.targetUids, scene })
        if (scene.get('cards', 'hand', card.uid) != null)
            discard({ cardUids: [args.cardUid], scene })

        activateSouvenirs('playCard', scene, card.characterUid)

        updateNpcMoves(scene)
    } else {
        logger.warn('tried to play unplayable card: ' + args.cardUid)
    }

    updateCharacters(scene)
    updateHand(scene)
}

function isPlayable({
    card,
    scene,
}: {
    card: Card
    scene: BattleCursor
}): boolean {
    if (scene.get('numRequiredToDiscard') > 0) return false

    if (getEnergy(card) < 0 || getEnergy(card) > scene.get('energy'))
        return false

    const requiredStance = card.actions.match(/ifStance\([^"]*"([^"]+)/)?.[1]

    if (
        requiredStance &&
        scene.get('allCharacters', card.characterUid, 'stance') !==
            requiredStance
    )
        return false

    return true
}
