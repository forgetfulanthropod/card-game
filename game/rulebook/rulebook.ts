import type { DungeonLevel, Rulebook } from 'shared'
import { rulebookVersion } from 'shared/code'

import {
    getDungeonRooms,
    stanceTypeMetaMap,
    playerCharacterStatsMap,
    dungeonTemplates,
    roomOptions,
} from './battle'
import { npcStatsMapByLevel } from './npcStatsMapByLevel'
import { ensureRulebooksMigrated } from './RulebookManager'

const dungeonLevels: DungeonLevel[] = [
    { name: 'Skelepit Dungeon', num: 0, modifier: 1 },
    { name: 'Hooligans Bluff', num: 1, modifier: 1 },
    { name: 'The Matcha Caves', num: 2, modifier: 2 },
    { name: 'Fort Skeleton', num: 3, modifier: 3 },
    {
        name: 'The Ninth Trash Hole of Hell',
        num: 4,
        modifier: 5,
    },
]

const defaultRulebook: Rulebook = {
    version: rulebookVersion,
    name: 'default',
    npcStatsMapByLevel: npcStatsMapByLevel,
    playerCharacterStatsMap: playerCharacterStatsMap,
    dungeonLevels,
    stanceTypeMetaMap,
    // dungeonRooms: getDungeonRooms(),
    dungeonTemplates: dungeonTemplates,
    roomOptions: roomOptions,
    // npcNames,
}
let rulebook = defaultRulebook

export function setRulebook(r: Rulebook): void {
    rulebook = r
    // ensure handled by manager callers (avoid reentrancy); migration called explicitly on paths
}

export function getRulebook(): Rulebook {
    // MANDATORY: callers or init ensure migration. get itself returns current (side effects in set/init)
    return rulebook
}

/** Internal for manager to peek without recursion */
export function getCurrentRawRulebookForMigration(): Rulebook {
    return rulebook
}

export function resetRulebook(): void {
    rulebook = defaultRulebook
}
