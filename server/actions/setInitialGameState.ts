import { getInitialGameState } from 'game'
import type { ServerActions } from 'shared'
import { setGamestate } from '@/db'
import { emitUpdatedGameState } from '@/IO'
import { migratePlayerGamestateSave } from '../../game/rulebook/RulebookManager'
import { buildInitialGameState } from '../../game/entryBootstrap'

export const setInitialGameState: ServerActions['setInitialGameState'] = async ({
    userId,
    sceneId,
}: any) => {
    const effScene = sceneId || 'entry'
    // Load existing if present, migrate its curRulebook in place (real save mutation)
    let existing: any = null
    try { existing = await require('@/db').getGamestate(userId) } catch {}
    if (existing) {
        migratePlayerGamestateSave(existing)
    }
    // Build using bootstrap so per-scene rulebook + migrated snapshot is used
    const initialGameState = buildInitialGameState({ userId, sceneId: effScene, existingState: existing })
    setGamestate(userId, initialGameState)
    emitUpdatedGameState(userId, initialGameState)
}
