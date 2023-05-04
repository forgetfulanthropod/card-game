import { getInitialGameState } from 'game'
import type { ServerActions } from 'shared'
import { setGamestate } from '@/db'
import { emitUpdatedGameState } from '@/IO'

export const setInitialGameState: ServerActions['setInitialGameState'] = async ({
    userId,
}) => {
    const initialGameState = getInitialGameState(userId)
    setGamestate(userId, initialGameState)
    emitUpdatedGameState(userId, initialGameState)
}
