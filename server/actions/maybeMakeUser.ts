
import { has } from 'lodash'

import { commit, getRootCursor } from '@/util'
import { addNewUser } from '@/util/addNewUser'

/** Very special case! */
export const maybeMakeUser = (req: any) => {
    const username: string = req.body.username
    req.session.username = username
    logger.info(`adding user ${username} with initial gamestate`)
    const users = getRootCursor().get('users')
    if (has(users, username)) {
        logger.info(`already has user ${username}`)
    } else {
        logger.info(`making new user ${username}`)
        addNewUser({ username })
    }
    commit(getRootCursor().select('users').select(username))
}
