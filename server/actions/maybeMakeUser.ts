import type { Gamestate } from 'shared'

import { setSocketId } from '../index'
// import { hasUser } from '@/database'
import {
    getDb,
    //  getDb,
    getRootCursor,
} from '../treeUtils'
import { makeNewUser } from './makeNewUser'

/** Very special case! */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types,@typescript-eslint/no-explicit-any
export const maybeMakeUser = (req: any): Gamestate => {
    const username: string = req.body.username
    req.session.username = username
    setSocketId(username, req.session.socketio)
    const maybeUser = getDb().data?.users?.[username]
    if (maybeUser) {
        getRootCursor().select('users').set(username, maybeUser)
    }
    const userCursor = getRootCursor().select('users')
    if (!userCursor.exists(username)) {
        logger.info(`adding user ${username} with initial gamestate`)
        makeNewUser({ username })
    }
    // commit(getRootCursor().select('users').select(username), username)
    return userCursor.get(username)
}
