import type { Gamestate } from '@shared'

// import { hasUser } from '@/database'
import {
    getDb,
    //  getDb,
    getRootCursor,
} from '@/util'
import { addNewUser } from '@/util/addNewUser'

import { setSocketId } from '..'

/** Very special case! */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types,@typescript-eslint/no-explicit-any
export const maybeMakeUser = (req: any): Gamestate => {
    const username: string = req.body.username
    req.session.username = username
    setSocketId(username, req.session.socketio)
    // const users = getRootCursor().get('users')
    // if (await hasUser(username)) {
    //     logger.info(`already has user ${username}`)
    // } else {
    // const maybeUser = getDb().get(username)
    // if (maybeUser) {
    //     getRootCursor().select('users').set(username, maybeUser)
    // }
    const maybeUser = getDb().data?.users?.[username]
    logger.info(JSON.stringify({ maybeUser }))
    if (maybeUser) {
        getRootCursor().select('users').set(username, maybeUser)
    }
    const userCursor = getRootCursor().select('users')
    if (!userCursor.exists(username)) {
        logger.info(`adding user ${username} with initial gamestate`)
        addNewUser({ username })
    }
    // commit(getRootCursor().select('users').select(username), username)
    return userCursor.get(username)
}
