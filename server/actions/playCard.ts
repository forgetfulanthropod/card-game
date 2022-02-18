import type { PlayCard } from '@serverActions'
import type { Card, CardUid } from '@shared'

import type { BattleCursor } from '@/util'
import { getBattleScene } from '@/util'

import { discard } from '../gameState/battle/cards/discard'
import { play } from '../gameState/battle/cards/play'
import { getEnergy } from '../gameState/battle/energy/getEnergy'

export const BASE_HAND_SIZE = 5

export const playCard: PlayCard = args => {
    const scene = getBattleScene(args.username)
    const card = findCard({ cardUid: args.cardUid, scene })

    if (isPlayable({ card, scene })) {
        play({ card, targetUids: args.targetUids, scene })
        discard({ cardUid: args.cardUid, card, scene })
    }
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
