import type { BattleCursor, ClaimableLoot, GameActions } from 'shared'

import { getBattleSceneIn } from '@/util'
import { getInitialLoot } from '@/gameState'
import { isEmpty, keys, last } from 'lodash'
import { nextRoom } from './nextRoom'

export const collectLoot: GameActions['collectLoot'] = args => {
    const scene = getBattleSceneIn(args.game)
    const remainingLoot = scene.get('lootEarned')
    const newRemainingLoot = collectCurrentLootItem(remainingLoot, scene)

    if (isEmpty(newRemainingLoot)) {
        nextRoom(args)
    } else if (remainingLoot[0].name === 'draftCard') {
        scene.set('state', 'choosing cards')
    } else {
        collectCurrentLootItem(remainingLoot, scene)
    }
}

function transferLootToInventory(scene: BattleCursor) {
    // TODO implement loot inventory
    // transfer()
    return
}

function collectCurrentLootItem(
    remainingLoot: ClaimableLoot,
    scene: BattleCursor
): ClaimableLoot {
    transferLootToInventory(scene)
    const newRemainingLoot = remainingLoot.slice(1) as ClaimableLoot;
    scene.set('lootEarned', newRemainingLoot)
    return newRemainingLoot
}
