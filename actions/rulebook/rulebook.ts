import type { DungeonLevel, Rulebook } from '@shared'

import { numbers } from '@/gameState/battle'

import { moveMetaMap, stanceTypeMetaMap, statsMap } from './battle'


const dungeonLevels: DungeonLevel[] = [
    { name: 'Hooligan’s Bluff', num: 1, pointLimit: 20, modifier: 1, },
    { name: 'The Matcha Caves', num: 2, pointLimit: 40, modifier: 2, },
    { name: 'Fort Skeleton', num: 3, pointLimit: 65, modifier: 3, },
    { name: 'The Ninth Trash Hole of Hell', num: 4, pointLimit: 100, modifier: 5, },
]
export const rulebook: Rulebook = {
    characters: statsMap,
    moveMetaMap,
    recipes: {},
    locations: {},
    dungeonLevels: dungeonLevels,
    items: {},
    numbers,
    stanceTypeMetaMap,
}
