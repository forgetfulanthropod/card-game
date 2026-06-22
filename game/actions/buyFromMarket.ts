import type { GameActions } from 'shared'

/**
 * buyFromMarket - existing action hook for web marketplace / dynamic economy.
 * Post-battle + post-PvP gems awarded separately.
 * Stub: deducts cost, "buys" (logs).
 */
export const buyFromMarket: GameActions['buyFromMarket'] = (args: any) => {
    const { game, itemId, cost = 10 } = args
    // Stub: award or deduct from hypothetical gems. For real would use inventory.
    const currentGems = (game.select('events').get('gems') as number) || 0
    if (currentGems >= cost) {
        game.select('events').set('gems', currentGems - cost)
        console.log('[buyFromMarket] purchased', itemId)
    } else {
        console.log('[buyFromMarket] insufficient gems for', itemId)
    }
}
