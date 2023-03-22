import type { Card, BattleCursor, GameActions, CharacterUid } from 'shared'

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
import { getTargetUids } from '@/gameState/battle/cards/getTargetUids'
import { trackMetric } from 'server/metrics'
import { activateSouvenirs } from '@/gameState/battle/activateSouvenirs'

export const playCard: GameActions['playCard'] = args => {
    const scene = getBattleSceneIn(args.game)
    if (scene.get('state') !== 'in battle' || scene.get('isInMap') === true) {
        logger.warn('tried to play card while not in battle')
        return
    }
    const card =
        scene.get('cards', 'hand', args.cardUid) ??
        throwNull(`cardUid ${args.cardUid}`)
    const targetUids = getTargetUids({
        card,
        targetUids: args.targetUids,
        scene,
    })
    if (isPlayable({ card, scene, targetUids })) {
        scene.select('allCharacters', card.characterUid).set('hasMoved', true)
        // get target hp before card play for metric
        trackMetric('playCard', { card, scene, targetUids: args.targetUids })
        play({ card, targetUids: args.targetUids, scene })
        if (scene.get('cards', 'hand', card.uid) != null)
            discard({ cardUids: [args.cardUid], scene })

        activateSouvenirs('playCard', scene, card.characterUid)

        updateNpcMoves(scene)
        updateCharacters(scene)
        updateHand(scene)
    } else {
        logger.warn('tried to play unplayable card: ' + args.cardUid)
    }
}

function isPlayable({
    card,
    scene,
    targetUids,
}: {
    card: Card
    scene: BattleCursor
    targetUids?: CharacterUid[]
}): boolean {
    if (scene.get('numRequiredToDiscard') > 0) return false

    if (card.targetNum > 0 && targetUids?.length !== card.targetNum) {
        logger.info(
            `tried to play card ${card.id} but number of targets was off`
        )
        return false
    }

    if (getEnergy(card) < 0 || getEnergy(card) > scene.get('energy'))
        return false

    const allCharacters = scene.get('allCharacters')
    if (targetUids?.length) {
        const livingTargets = Object.entries(allCharacters)
            .filter(([k, v]) => targetUids?.includes(k) && v.health > 0)
            .map(([k, _]) => k)
        if (!livingTargets.length) return false
    }

    const requiredStance = card.actions.match(/ifStance\([^"]*"([^"]+)/)?.[1]

    if (
        requiredStance &&
        scene.get('allCharacters', card.characterUid, 'stance') !==
            requiredStance
    )
        return false

    return true
}
