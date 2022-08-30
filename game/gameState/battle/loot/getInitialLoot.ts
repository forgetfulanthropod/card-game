import type { BattleCursor, LootEarned } from 'shared'

import { vals } from 'shared/code'

/**
 * Initialize loot at zero.
 * Loot is updated by calculateLoot when battle or dungeon run is over.
 */
export function getInitialLoot(): LootEarned {
    return {
        items: { gems: 0, tokenTBD: 0, placeholder: '' },
        claimed: false,
    }
}
