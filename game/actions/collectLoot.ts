import type { BattleCursor, GameActions } from 'shared'

import { getBattleSceneIn } from '@/util'
import { getInitialLoot } from '@/gameState'

export const collectLoot: GameActions['collectLoot'] = args => {
    const scene = getBattleSceneIn(args.game)
    transferLootToInventory(scene)
    scene.set('lootEarned', getInitialLoot())
    scene.set('state', 'choosing cards')
}

function transferLootToInventory(scene: BattleCursor) {
    // TODO implement loot inventory
    scene.set('lootEarned', { ...scene.get('lootEarned'), claimed: true })
    return
}
