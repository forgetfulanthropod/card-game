import type { ServerActions } from 'shared'

import { makeNewUser } from './makeNewUser'
import { getGamestate } from '@/db'
import { emitNewGamestate } from '@/IO'

export const maybeMakeUser: ServerActions['maybeMakeUser'] = async ({
    username,
}) => {
    const maybeGamestate = await getGamestate(username)
    if (maybeGamestate != null) {
        emitNewGamestate(username, maybeGamestate)
        return
    }
    await makeNewUser({ username })
}
