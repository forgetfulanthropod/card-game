import type { GameActions, OwnedCharacterStats } from 'shared'
import { getRulebook } from '@/rulebook'
import { keys } from 'shared/code'

/**
 * buyFromMarket - marketplace buy for characters ('char:<id>') and items ('item:<name>').
 * Always deducts cost from events.gems if sufficient.
 * For chars: clone entry from rulebook playerCharacterStatsMap into ownedCharacters with fresh uid.
 * For items: record in events.purchases so visible.
 * Marketplace shows offers from different players (UI attribution) and supports buys for 'char:'/'item:'.
 */
export const buyFromMarket: GameActions['buyFromMarket'] = (args: any) => {
    const { game, itemId, cost = 10 } = args
    const currentGems = (game.select('events').get('gems') as number) || 0
    if (currentGems < cost) {
        console.log('[buyFromMarket] insufficient gems for', itemId)
        return
    }
    game.select('events').set('gems', currentGems - cost)

    if (typeof itemId === 'string' && itemId.startsWith('char:')) {
        const charId = itemId.slice(5)
        const rb = getRulebook()
        const statsMap = rb.playerCharacterStatsMap || {}
        const base = statsMap[charId]
        if (base) {
            const freshUid = `${charId}-mkt-${Date.now().toString(36)}-${Math.floor(Math.random()*1000)}` as any
            const clone: OwnedCharacterStats = { ...base, uid: freshUid, isPc: true }
            const owned = game.select('ownedCharacters').get() || {}
            game.select('ownedCharacters').set({ ...owned, [freshUid]: clone })
            console.log('[buyFromMarket] purchased character', charId, 'as', freshUid)
        } else {
            console.log('[buyFromMarket] unknown char id', charId)
        }
        return
    }

    if (typeof itemId === 'string' && itemId.startsWith('item:')) {
        const itemName = itemId.slice(5)
        const purchases = (game.select('events').get('purchases') as any[]) || []
        game.select('events').set('purchases', [...purchases, { itemId, at: Date.now() }])
        console.log('[buyFromMarket] purchased item', itemName)
        return
    }

    // fallback legacy
    console.log('[buyFromMarket] purchased', itemId)
}
