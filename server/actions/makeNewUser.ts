
import type { MakeNewUser } from '@shared'

import { commit, getRootCursor } from '@/util'
import { addNewUser } from '@/util/addNewUser'

export const makeNewUser: MakeNewUser = (args) => {
    logger.info(`adding user ${args.username} with initial gamestate`)
    addNewUser(args)
    commit(getRootCursor())
}
