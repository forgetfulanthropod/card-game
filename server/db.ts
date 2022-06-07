import type { Gamestate, Gamecursor } from 'shared'
import { Level } from 'level'

import { SBaobab } from 'sbaobab'
import type { Username } from './types'

const db = new Level<Username, Gamestate>(__dirname + '/leveldb', {
    valueEncoding: 'json',
})
const userPrefix = 'user-'

export async function getGamestate(
    username: string
): Promise<Gamestate | null> {
    try {
        return await db.get(userPrefix + username)
    } catch (e) {
        return null
    }
}

export async function setGamestate(username: string, gamestate: Gamestate) {
    logger.info(`user ${username} is in scene ${gamestate.scene.name}`)
    await db.put(userPrefix + username, gamestate)
}

export async function getGameStateCursor(
    username: string
): Promise<Gamecursor> {
    const gamestate = await getGamestate(username)
    if (gamestate == null) {
        throw Error(`no gamestate for user ${username}`)
    }
    return new SBaobab(gamestate).select()
}
