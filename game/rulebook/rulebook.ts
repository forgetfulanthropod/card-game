import type { DungeonLevel, Rulebook } from 'shared'
import { rulebookVersion } from 'shared/code'

import {
    getDungeonRooms,
    stanceTypeMetaMap,
    playerCharacterStatsMap,
} from './battle'
import { npcStatsMapByLevel } from './npcStatsMapByLevel'

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
    dungeonRooms: getDungeonRooms(),
    // npcNames,
}
let rulebook = defaultRulebook

export function setRulebook(r: Rulebook): void {
    rulebook = r
}

export function getRulebook(): Rulebook {
    return rulebook
}

export function resetRulebook(): void {
    rulebook = defaultRulebook
}
