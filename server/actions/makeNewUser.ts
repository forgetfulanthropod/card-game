// import { setUser } from '@/database'

import { getInitialGameState } from 'game'
import type { ServerActions } from 'shared'
import { setGamestate } from '@/db'
import { emitNewGamestate } from '@/IO'

export const makeNewUser: ServerActions['makeNewUser'] = ({ username }) => {
    const gs = getInitialGameState(username)
    setGamestate(username, gs)
    emitNewGamestate(username, gs)
}
