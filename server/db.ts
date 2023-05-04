// todo change file name to gamestateDB.ts
import type { GameState, Gamecursor, UserID } from 'shared'
import { Level } from 'level'

import { SBaobab } from 'sbaobab'

const db = new Level<UserID, GameState>(__dirname + '/leveldb', {
    valueEncoding: 'json',
})
const userPrefix = 'user-'

const cache: Record<UserID, GameState> = {}

export async function getGamestate(
    userId: UserID
): Promise<GameState | null> {
    if (cache[userId]) return cache[userId]
    try {
        return await db.get(userPrefix + userId)
    } catch (e) {
        return null
    }
}

export function setGamestate(userId: UserID, gamestate: GameState) {
    cache[userId] = gamestate
    void db.put(userPrefix + userId, gamestate)
}

export async function getGameStateCursor(
    userId: UserID
): Promise<Gamecursor> {
    const gamestate = await getGamestate(userId)
    if (gamestate == null) {
        throw Error(`no gamestate for user ${userId}`)
    }
    return new SBaobab(gamestate).select()
}
