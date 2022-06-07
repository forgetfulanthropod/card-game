import type { Gamestate } from 'shared'

import { makeNewUser } from './makeNewUser'
import { getGamestate } from '@/db'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const maybeMakeUser = async (req: any): Promise<Gamestate> => {
    const username: string = req.body.username
    if (typeof username !== 'string')
        throw Error(`username '${username}' is not string`)
    const maybeGamestate = await getGamestate(username)
    if (maybeGamestate != null) return maybeGamestate
    logger.info(`adding user ${username} with initial gamestate`)
    return await makeNewUser(req)
}
