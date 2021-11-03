
import type { MakeNewUser } from '@shared'

import { getInitialGameState } from '@/gameState/gameState'
import { commit, getRootCursor } from '@/util'

export const makeNewUser: MakeNewUser = (args) => {
    logger.info(`adding user ${args.username} with initial gamestate`)
    addNewUser(args)
    commit(getRootCursor())
}

export function addNewUser(args: { username: 'alice' }): void {
    getRootCursor().select('users').select(args.username).set(getInitialGameState())
}
