import type { Gamestate } from 'shared'

import type { Request } from 'express'
import { makeNewUser } from './makeNewUser'
import { getGamestate } from '@/db'

export const maybeMakeUser = async (req: Request): Promise<Gamestate> => {
    const username: string = req.body.username
    if (typeof username !== 'string')
        throw Error(`username '${username}' is not string`)
    const maybeGamestate = await getGamestate(username)
    if (maybeGamestate != null) return maybeGamestate
    logger.info(`adding user ${username} with initial gamestate`)
    return await makeNewUser(req)
}
