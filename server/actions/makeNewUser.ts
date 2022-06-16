// import { setUser } from '@/database'

import { getInitialGameState } from 'game'
import type { ServerActions } from 'shared'
import { setGamestate } from '@/db'
import { emitNewGamestate } from '@/IO'

export const makeNewUser: ServerActions['makeNewUser'] = async ({
    username,
}): Promise<void> => {
    const gs = getInitialGameState(username)
    await setGamestate(username, gs)
    emitNewGamestate(username, gs)
}
