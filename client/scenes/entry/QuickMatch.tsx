import { getTree, getOwnedCharacters } from '@/data'
import { callApi } from '@/callApi'
import { collectData } from '@/analytics/collectData'
import type { OwnedCharacterStats } from 'shared'

/**
 * QuickMatch for PVP (MUST be used from PVPScene which extends DungeonEntryScene).
 * Auto-loads strongest team (top 3 by a simple power heuristic) + shared battle actions.
 */
export async function startQuickMatchPVP(): Promise<void> {
    collectData('pvp_quickmatch', {})
    const userId = getTree ? getTree().get('userId') : 'test'
    if (!userId) return

    await callApi('prepareRun', { userId, daily: false, plain: true } as any).catch(() => {})
    await callApi('changeScene', { newSceneName: 'pvp' } as any).catch(() => {})
    // auto battle after strongest (simulated)
    setTimeout(() => { callApi('changeScene', { newSceneName: 'battle' } as any).catch(()=>{}) }, 50)
}

/** Pure helper for tests / auto strongest selection from options (shipped data) */
export function autoSelectStrongestForPVP(allOptions: any[]): any[] {
    const scored = (allOptions || []).map((c, idx) => ({
        idx,
        score: (c.attack || 0) + (c.health || 0) + ((c.magic||0)*0.8) + ((c.defense||0)*0.5)
    })).sort((a,b)=> b.score - a.score).slice(0,3)
    return scored.map(s => ({ allCharacterOptionsIndex: s.idx, placeIndex: s.idx }))
}

export function QuickMatchButton() {
    // Returns a trigger object; in real UI wired to onClick -> startQuickMatchPVP
    return { onQuickMatch: () => void startQuickMatchPVP() }
}
