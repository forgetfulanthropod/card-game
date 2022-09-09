import type { BattleCursor, ClaimableLoot, GameActions } from 'shared'

import { getBattleSceneIn } from '@/util'
import { getInitialLoot } from '@/gameState'
import { isEmpty, keys, last } from 'lodash'
import { nextRoom } from './nextRoom'

export const collectLoot: GameActions['collectLoot'] = args => {
    const scene = getBattleSceneIn(args.game)
    const remainingLoot = scene.get('lootEarned')

    if (isEmpty(remainingLoot)) {
        nextRoom(args)
    } else if (remainingLoot[0].name === 'draftCard') {
        scene.set('state', 'choosing cards')
    } else {
        collectCurrentLootItem(remainingLoot, scene)
    }
}

function transferLootToInventory(scene: BattleCursor) {
    // TODO implement loot inventory
    return
}


function collectCurrentLootItem(
    remainingLoot: ClaimableLoot,
    scene: BattleCursor
): void {
    if (isEmpty(remainingLoot)) return
    transferLootToInventory(scene);
    scene.set('lootEarned', scene.get('lootEarned').slice(1))
}
