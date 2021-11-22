
import type { MaybeMakeUser } from '@serverActions'
import { has } from 'lodash'

import { getRootCursor } from '@/util'
import { addNewUser } from '@/util/addNewUser'

export const maybeMakeUser: MaybeMakeUser = (args) => {
    const { username } = args
    logger.info(`adding user ${username} with initial gamestate`)
    const users = getRootCursor().get('users')
    if (has(users, username)) {
        logger.info(`already has user ${username}`)
        return
    }
    logger.info(`making new user ${username}`)
    addNewUser(args)
}
