import type { ServerActions } from 'shared'

import { setInitialGameState } from './setInitialGameState'
import { getGamestate } from '@/db'
import { emitUpdatedGameState } from '@/IO'

export const loadGameState: ServerActions['loadGameState'] = async ({
    username,
}) => {
    const existingGameState = await getGamestate(username)
    if (existingGameState) return emitUpdatedGameState(username, existingGameState)
    else setInitialGameState({ username })
}
