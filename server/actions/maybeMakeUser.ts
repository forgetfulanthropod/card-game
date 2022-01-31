import type { Gamestate } from '@shared'

import { hasUser } from '@/database'
import { getRootCursor } from '@/util'
import { addNewUser } from '@/util/addNewUser'

import { setSocketId } from '..'

/** Very special case! */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types,@typescript-eslint/no-explicit-any
export const maybeMakeUser = async (req: any): Promise<Gamestate> => {
    const username: string = req.body.username
    req.session.username = username
    setSocketId(username, req.session.socketio)
    // const users = getRootCursor().get('users')
    if (await hasUser(username)) {
        logger.info(`already has user ${username}`)
    } else {
        logger.info(`adding user ${username} with initial gamestate`)
        addNewUser({ username })
    }
    // commit(getRootCursor().select('users').select(username), username)
    return getRootCursor().select('users').get(username)
}
