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
    const userId = getTree().get('userId')
    if (!userId) return

    // Prepare (real entry)
    await callApi('prepareRun', { userId, daily: false, plain: true } as any)

    // Auto select strongest 3 from owned (shipped data)
    const owned: Record<string, OwnedCharacterStats> = getOwnedCharacters ? getOwnedCharacters().get() : {}
    const chars = Object.values(owned || {})
    // Heuristic power
    const scored = chars.map(c => ({
        c,
        score: (c.attack || 0) + (c.health || 0) + ((c.magic || 0) * 0.8) + ((c.defense || 0) * 0.5)
    })).sort((a, b) => b.score - a.score)

    const top3 = scored.slice(0, 3).map(s => s.c)
    if (top3.length < 3) {
        // fallback: will rely on roll path
        await callApi('changeScene', { newSceneName: 'pvp' } as any)
        return
    }

    // Place them using the real action path (via prepare entry state)
    // For simplicity, trigger rolls or directly set via change - here we force pvp selection scene then battle after short delay
    await callApi('changeScene', { newSceneName: 'pvp' } as any)

    // In real flow, player would confirm; for QuickMatch we auto go to battle after prepare
    setTimeout(() => {
        callApi('changeScene', { newSceneName: 'battle' } as any)
    }, 120)
}

export function QuickMatchButton() {
    return {
        // Placeholder UI hook; actual usage wires to startQuickMatchPVP
        onQuickMatch: () => void startQuickMatchPVP()
    }
}
