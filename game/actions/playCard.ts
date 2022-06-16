import type { Card, BattleCursor, GameActions } from 'shared'

import { throwNull } from 'shared/code'
import {
    discard,
    getEnergy,
    getLivingNpcs,
    play,
    updateHand,
} from '@/gameState'
import { getBattleSceneIn } from '@/util'

export const playCard: GameActions['playCard'] = args => {
    const scene = getBattleSceneIn(args.game)
    const card =
        scene.get('cards', 'hand', args.cardUid) ??
        throwNull(`cardUid ${args.cardUid}`)

    // logger.info(`playing card ${card.uid}`)
    if (isPlayable({ card, scene })) {
        play({ card, targetUids: args.targetUids, scene })
        discard({ cardUids: [args.cardUid], scene })
    }

    clearDead(scene)
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

function _clearDeadCharacters(_scene: BattleCursor) {
    throw new Error('Function not implemented.')
}
