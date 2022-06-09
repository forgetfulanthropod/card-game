import type { Card, CardUid, BattleCursor } from 'shared'
import type { GameActions } from './types'

import {
    discard,
    getEnergy,
    getLivingNpcs,
    play,
    updateHand,
} from '@/gameState'
import { getBattleSceneIn } from '@/util'

export const playCard: GameActions['PlayCard'] = args => {
    const scene = getBattleSceneIn(args.game)
    const card = findCard({ cardUid: args.cardUid, scene })

    if (isPlayable({ card, scene })) {
        play({ card, targetUids: args.targetUids, scene })
        discard({ cardUid: args.cardUid, card, scene })
    }

    clearDead(scene)
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

function clearDead(scene: BattleCursor) {
    //todo
    // clearDeadCharacters(scene)
    clearDeadCommands(scene)
}

function clearDeadCommands(scene: BattleCursor) {
    const livingNpcUids = getLivingNpcs(scene.get()).map(npc => npc.uid)
    if (scene.get('nextNpcCommands').length !== livingNpcUids.length) {
        scene.apply('nextNpcCommands', nextCommands =>
            nextCommands.filter(cmd =>
                livingNpcUids.includes(cmd.command.characterUid)
            )
        )
    }
}

function clearDeadCharacters(scene: BattleCursor) {
    throw new Error('Function not implemented.')
}
