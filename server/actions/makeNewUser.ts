
import { initialGameState } from '@/gameState/gameState'
import { getRootCursor } from '@/util'

import type { MakeNewUser } from '@shared'
export const makeNewUser: MakeNewUser = (args) => {
    logger.info(`adding user ${args.username} with initial gamestate`)
    getRootCursor().select('users').select(args.username).set(initialGameState)
    getRootCursor().commit()
}
