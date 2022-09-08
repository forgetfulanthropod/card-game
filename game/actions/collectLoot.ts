import type { BattleCursor, GameActions, LootFromGame } from 'shared'

import { getBattleSceneIn } from '@/util'
import { getInitialLoot } from '@/gameState'
import { isEmpty, keys, last } from 'lodash'
import { nextRoom } from './nextRoom'

export const collectLoot: GameActions['collectLoot'] = args => {
    const scene = getBattleSceneIn(args.game)
    const remainingLoot = getRemainingLoot(scene)

    if (remainingLoot.includes('draftCard')) {
        scene.set('state', 'choosing cards')
    } else if (isEmpty(remainingLoot)) {
        nextRoom(args)
    } else {
        collectCurrentLootItem(remainingLoot, scene)
    }
}

function transferLootToInventory(scene: BattleCursor) {
    // TODO implement loot inventory
    return
}

function getRemainingLoot(scene: BattleCursor): Array<keyof LootFromGame> {
    const loot = scene.get('lootEarned')
    return Object.keys(loot).filter(key => {
        let lootItem = key as keyof LootFromGame
        return loot[lootItem] > 0
    }) as Array<keyof LootFromGame>
}

function collectCurrentLootItem(remainingLoot: Array<keyof LootFromGame>, scene: BattleCursor): void {
    const currentLootItem = last(remainingLoot) as keyof LootFromGame
    scene.set('lootEarned', {
        ...scene.get('lootEarned'),
        [currentLootItem]: 0,
    })
}
