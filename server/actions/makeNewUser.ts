import type { MakeNewUser } from '@serverActions'

import { addNewUser } from '@/util/addNewUser'

export const makeNewUser: MakeNewUser = args => {
    logger.info(`adding user ${args.username} with initial gamestate`)
    addNewUser(args)
}
