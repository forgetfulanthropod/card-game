import type { DungeonLevel, Rulebook } from '@shared'
import { rulebookVersion } from '@shared/code'

import { orderRulebook } from '@/util'

import { moveMetaMap, npcLevelStatsMap, specialDoorsMap, stanceTypeMetaMap, statsMap } from './battle'
import { dungeonRooms } from './dungeonRooms'
import { eventTriggersMap } from './eventTriggersMap'


const dungeonLevels: DungeonLevel[] = [
    { name: 'Hooligan’s Bluff', num: 1, pointLimit: 20, modifier: 1 },
    { name: 'The Matcha Caves', num: 2, pointLimit: 40, modifier: 2 },
    { name: 'Fort Skeleton', num: 3, pointLimit: 65, modifier: 3 },
    { name: 'The Ninth Trash Hole of Hell', num: 4, pointLimit: 100, modifier: 5 },
]


const defaultRulebook: Rulebook = orderRulebook({
    version: rulebookVersion,
    name: 'default',
    characters: statsMap,
    moveMetaMap,
    npcLevelStatsMap,
    recipes: {},
    locations: {},
    dungeonLevels,
    dungeonRooms,
    items: {},
    stanceTypeMetaMap,
    // npcNames,
    specialDoorsMap,
    eventTriggersMap,
    levelThresholds: {
        2: 100,
        3: 200,
        4: 300,
        5: 400,
        6: 500,
        7: 600,
        8: 700,
        9: 800,
    },
})
let rulebook = defaultRulebook

export function setRulebook(r: Rulebook): void { rulebook = r }

export function getRulebook(): Rulebook { return rulebook }

export function resetRulebook(): void { rulebook = defaultRulebook }
