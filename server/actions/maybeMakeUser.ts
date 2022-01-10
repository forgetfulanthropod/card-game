import type { Gamestate } from '@shared'
import { has } from 'lodash'

import { commit, getRootCursor } from '@/util'
import { addNewUser } from '@/util/addNewUser'

import { setSocketId } from '..'

/** Very special case! */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types,@typescript-eslint/no-explicit-any
export const maybeMakeUser = (req: any): Gamestate => {
    const username: string = req.body.username
    req.session.username = username
    setSocketId(username, req.session.socketio)
    logger.info(`adding user ${username} with initial gamestate`)
    const users = getRootCursor().get('users')
    if (has(users, username)) {
        logger.info(`already has user ${username}`)
    } else {
        logger.info(`making new user ${username}`)
        addNewUser({ username })
    }
    commit(getRootCursor().select('users').select(username), username)
    return getRootCursor().select('users').get(username)
}
