import { getInitialGameState } from 'game'
import type { ServerActions } from 'shared'
import { setGamestate } from '@/db'
import { emitUpdatedGameState } from '@/IO'
import { migratePlayerGamestateSave } from '../../game/rulebook/RulebookManager'

export const setInitialGameState: ServerActions['setInitialGameState'] = async ({
    userId,
    sceneId,
}: any) => {
    // Read existing if any, migrate its curRulebook snapshot, then build with correct rulebook for scene
    let existing
    try { existing = await require('@/db').getGamestate(userId) } catch {}
    if (existing) {
        migratePlayerGamestateSave(existing)
    }
    const initialGameState = getInitialGameState(userId, sceneId || 'entry')
    setGamestate(userId, initialGameState)
    emitUpdatedGameState(userId, initialGameState)
}
