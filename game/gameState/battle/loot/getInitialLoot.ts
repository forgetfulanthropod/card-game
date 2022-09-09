import type { ClaimableLoot } from 'shared'

/**
 * Initialize loot at zero.
 * Loot is updated by calculateLoot when battle or dungeon run is over.
 */
export function getInitialLoot(): ClaimableLoot {
    return []
}
