import type { BattleCursor, ClaimableLoot, GameActions } from 'shared'

import { getBattleSceneIn } from '@/util'
import { getInitialLoot } from '@/gameState'
import { isEmpty, keys, last } from 'lodash'
import { nextRoom } from './nextRoom'

export const collectLoot: GameActions['collectLoot'] = args => {
    const scene = getBattleSceneIn(args.game)
    const remainingLoot = scene.get('lootEarned')

    if (isEmpty(remainingLoot)) {
        return
    }
    if (remainingLoot[0].name === 'draftCard') {
        return scene.set('state', 'choosing cards')
    }

    const newRemainingLoot = collectCurrentLootItem(scene)
    if (isEmpty(newRemainingLoot)) {
        return (args.game.select('scene') as BattleCursor).set('isInMap', true)
    }

    return
}

function collectCurrentLootItem(scene: BattleCursor): ClaimableLoot {
    const currentLootItem = scene.get('lootEarned').at(0)
    if (currentLootItem) {
        scene.set('lootClaimed', [...scene.get('lootClaimed'), currentLootItem])
    } else {
        return []
    }

    const newRemainingLoot = scene.get('lootEarned').slice(1)
    scene.set('lootEarned', newRemainingLoot)
    return newRemainingLoot
}
