import { cloneDeep, keys } from 'lodash'
import type { CharacterMeta, DungeonName } from 'shared'

import { getLevelInfo, rearrangeNpcs } from './characterManagement'
import type { Room } from './doors'
import { getRulebook } from '@/rulebook'
import { vals } from '@/util'

export function modifyRoom(room: Room, dungeonName: DungeonName): Room {
    let enemies = room.enemies

    const increase = getLevelIncrease(dungeonName)

    if (increase > 0) {
        enemies = {}

        const enemyKeys = keys(room.enemies)
        // console.log('levelUpEnemy', levelUpEnemy(enemies[enemyKeys[0]], getLevelIncrease(dungeonName)))
        vals(room.enemies).forEach((e, i) => {
            const coinFlip = srandom() < 0.5
            // const coinFlip = false
            // console.log('coin flip was ' + (coinFlip ? 'heads' : 'tails'))
            if (coinFlip) {
                enemies[enemyKeys[i]] = levelUpEnemy(e, increase)
            } else {
                enemies[enemyKeys[i]] = e
                for (let i = 1; i < increase; i++) {
                    const cloneUid = `${enemyKeys[i]}_clone${i}`
                    enemies[cloneUid] = {
                        ...cloneDeep(e),
                        x: e.x + 20 * i,
                        y: e.y + 20 * i,
                        screenX: e.screenX + 60 * i,
                        screenY: e.screenY + 60 * i,
                        uid: cloneUid,
                    }
                }
            }
        })

        enemies = rearrangeNpcs(enemies)
    }

    return { ...room, enemies }
}

function getLevelIncrease(dungeonName: DungeonName): number {
    const dungeonLevelInfo = getRulebook().dungeonLevels.find(
        l => l.name === dungeonName
    )

    if (dungeonLevelInfo == null) {
        throw Error('level increase error')
    }

    const mod = dungeonLevelInfo.modifier

    return mod > 1 ? mod : 0
}

function levelUpEnemy(
    enemy: CharacterMeta,
    levelIncrease: number
): CharacterMeta {
    return {
        ...enemy,
        ...getLevelInfo(enemy.name, enemy.level + levelIncrease),
    }
}
