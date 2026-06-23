// todo change file name to gamestateDB.ts
import type { GameState, Gamecursor, UserID } from 'shared'
import { Level } from 'level'

import { SBaobab } from 'sbaobab'

const isVercel = !!process.env.VERCEL
let db: Level<UserID, GameState> | null = null
if (!isVercel) {
  try {
    db = new Level<UserID, GameState>(__dirname + '/leveldb', {
      valueEncoding: 'json',
    })
  } catch {
    db = null
  }
}
const userPrefix = 'user-'

const cache: Record<UserID, GameState> = {}

export async function getGamestate(
    userId: UserID
): Promise<GameState | null> {
    if (cache[userId]) return cache[userId]
    if (!db) return null
    try {
        return await db.get(userPrefix + userId)
    } catch (e) {
        return null
    }
}

export function setGamestate(userId: UserID, gamestate: GameState) {
    cache[userId] = gamestate
    if (!db) return
    try {
      void db.put(userPrefix + userId, gamestate)
    } catch {
      // ignore on ephemeral FS
    }
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
