import type { ServerActions } from '@serverActions'
import type { Card, CardUid } from 'shared'
import type { BattleCursor } from 'shared'

import { discard, getEnergy, play, updateHand } from '@/gameState/battle'
import { getBattleScene } from '@/util'

export const BASE_HAND_SIZE = 5

export const playCard: ServerActions['PlayCard'] = args => {
    const scene = getBattleScene(args.username)
    const card = findCard({ cardUid: args.cardUid, scene })

    if (isPlayable({ card, scene })) {
        play({ card, targetUids: args.targetUids, scene })
        discard({ cardUid: args.cardUid, card, scene })
    }

    updateHand(scene)
}

function findCard({
    cardUid,
    scene,
}: {
    cardUid: CardUid
    scene: BattleCursor
}): Card {
    const card = scene.select('cards').select('hand').select(cardUid).get()

    if (card == null)
        throw new Error(`card Uid ${cardUid} not found, something is wrong`)

    return card
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
