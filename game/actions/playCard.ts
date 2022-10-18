import type { Card, BattleCursor, GameActions } from 'shared'

import { throwNull } from 'shared/code'
import { discard, getEnergy, play, updateHand } from '@/gameState'
import { getBattleSceneIn } from '@/util'

export const playCard: GameActions['playCard'] = args => {
    const scene = getBattleSceneIn(args.game)
    const card =
        scene.get('cards', 'hand', args.cardUid) ??
        throwNull(`cardUid ${args.cardUid}`)

    // logger.info(`playing card ${card.uid}`)
    if (isPlayable({ card, scene })) {
        scene.select('allCharacters', card.characterUid).set('hasMoved', true)

        play({ card, targetUids: args.targetUids, scene })

        if (scene.get('cards', 'hand', card.uid) != null)
            discard({ cardUids: [args.cardUid], scene })
    }

    updateHand(scene)
}

function isPlayable({
    card,
    scene,
}: {
    card: Card
    scene: BattleCursor
}): boolean {
    const hasEnoughEnergy = getEnergy(card) <= scene.select('energy').get()

    return hasEnoughEnergy
}
