import type { CharacterMeta, CharacterName, DungeonName } from '@shared'
import { cloneDeep, keys } from 'lodash'

import { getRulebook } from '@/rulebook'
import { vals } from '@/util'

import { rearrangeNpcs } from './characterManagement'
import type { Room } from './doors'

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
    const dungeonLevelInfo = getRulebook().dungeonLevels.find(l => l.name === dungeonName)

    if (dungeonLevelInfo == null) {
        throw Error('level increase error')
    }

    const mod = dungeonLevelInfo.modifier

    return mod > 1 ? mod : 0
}

function levelUpEnemy(enemy: CharacterMeta, levelIncrease: number): CharacterMeta {
    return {
        ...enemy,
        ...getLevelInfo(enemy.name, enemy.level + levelIncrease),
    }
}

type LevelInfo = {
    damage: number
    maxHealth: number
    level?: number
    health?: number
}

//For enemies above level 10, add +3 attack/+21 health per level.
const MAX_DATA_LEVEL = 10
const OVER_MAX_ATTACK = 3
const OVER_MAX_HEALTH = 21
export function getLevelInfo(name: CharacterName, level: number): LevelInfo {
    const { npcLevelStatsMap } = getRulebook()

    const index = Math.min(level, MAX_DATA_LEVEL)
    const levelInfo: LevelInfo | undefined = npcLevelStatsMap[name]?.[index]
    if (levelInfo == null) {
        throw Error('undefined level info')
    }
    console.log({ levelInfo, level })

    if (level > MAX_DATA_LEVEL) {
        levelInfo.damage = levelInfo.damage + ((OVER_MAX_ATTACK * level) % MAX_DATA_LEVEL)
        levelInfo.maxHealth = levelInfo.maxHealth + ((OVER_MAX_HEALTH * level) % MAX_DATA_LEVEL)
    }

    levelInfo.health = levelInfo.maxHealth
    levelInfo.level = level

    return levelInfo
}
