import type { GameState, Gamecursor } from 'shared'
import { Level } from 'level'

import { SBaobab } from 'sbaobab'
import type { Username } from './types'

const db = new Level<Username, GameState>(__dirname + '/leveldb', {
    valueEncoding: 'json',
})
const userPrefix = 'user-'

const cache: Record<Username, GameState> = {}

export async function getGamestate(
    username: string
): Promise<GameState | null> {
    if (cache[username]) return cache[username]
    try {
        return await db.get(userPrefix + username)
    } catch (e) {
        return null
    }
}

export function setGamestate(username: string, gamestate: GameState) {
    cache[username] = gamestate
    void db.put(userPrefix + username, gamestate)
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
