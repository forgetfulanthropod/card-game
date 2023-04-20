import { getInitialGameState } from 'game'
import type { ServerActions } from 'shared'
import { setGamestate } from '@/db'
import { emitUpdatedGameState } from '@/IO'

export const setInitialGameState: ServerActions['setInitialGameState'] = ({
    username,
}) => {
    const initialGameState = getInitialGameState(username)
    setGamestate(username, initialGameState)
    emitUpdatedGameState(username, initialGameState)
}
