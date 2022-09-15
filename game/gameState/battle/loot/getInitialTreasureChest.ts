import type { TreasureChest } from 'shared'

export function getInitialTreasureChest(): TreasureChest {
    return { level: 1, progressPct: 0, state: 'pending' }
}
