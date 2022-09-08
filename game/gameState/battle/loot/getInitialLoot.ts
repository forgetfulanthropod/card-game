import type { BattleCursor, LootEarned, LootFromGame } from 'shared'

import { vals } from 'shared/code'

/**
 * Initialize loot at zero.
 * Loot is updated by calculateLoot when battle or dungeon run is over.
 */
export function getInitialLoot(): LootFromGame {
    return {
            draftCard: 0,
            gems: 0,
            tokenTBD: 0,
            fishStick: 0,
            swordShield: 0,
            potion: 0,
            bread: 0,
    }
}
