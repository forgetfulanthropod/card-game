import type { ServerActions } from 'shared'

import { setInitialGameState } from './setInitialGameState'
import { getGamestate } from '@/db'
import { emitUpdatedGameState } from '@/IO'

export const loadGameState: ServerActions['loadGameState'] = async ({
    userId,
}) => {
    const existingGameState = await getGamestate(userId)
    if (existingGameState) return emitUpdatedGameState(userId, existingGameState)
    else setInitialGameState({ userId })
}
