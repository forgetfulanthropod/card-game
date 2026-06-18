import fs from 'fs'
import path from 'path'
import type { UserID, RunID } from 'shared'
import { BUILD_VER } from 'shared'
import { getLogger } from 'game'

const logger = getLogger ? getLogger() : console

export interface RunRecord {
  run_id: number
  user_id: UserID
  run_status: 'initializing' | 'in_progress' | 'won' | 'lost' | 'abandoned'
  build_version: string
  start_ts: number
  end_ts?: number
  run_duration_in_sec?: number
  run_score?: number
  game_state?: any
}

export interface UserRecord {
  user_id: UserID
  username: string | null
  last_login_ts?: number
  last_auth_method?: string
  initial_auth_method?: string
  discovered?: {
    cards: string[]
    souvenirs: string[]
    swords: string[]
  }
}

interface DbShape {
  users: UserRecord[]
  runs: RunRecord[]
  nextRunId: number
}

const DB_PATH = path.join(process.cwd(), 'server', 'data', 'simple-db.json')

export const MAX_ACCOUNTS = 4

let db: DbShape = { users: [], runs: [], nextRunId: 1 }

function ensureDir() {
  const dir = path.dirname(DB_PATH)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
}

export function loadDb() {
  ensureDir()
  if (fs.existsSync(DB_PATH)) {
    try {
      const raw = fs.readFileSync(DB_PATH, 'utf8')
      db = JSON.parse(raw)
      if (!db.users) db.users = []
      if (!db.runs) db.runs = []
      if (!db.nextRunId) db.nextRunId = (db.runs.reduce((m, r) => Math.max(m, r.run_id), 0) || 0) + 1
      db.users.forEach(u => {
        if (!u.discovered) u.discovered = { cards: [], souvenirs: [], swords: [] }
      })
      logger.info(`Loaded simple json db with ${db.users.length} users, ${db.runs.length} runs`)
    } catch (e) {
      logger.error('Failed to load db, starting fresh', e)
      db = { users: [], runs: [], nextRunId: 1 }
    }
  } else {
    // start empty - user creates by typing unique username (4 account max)
    db.users = []
    db.runs = []
    db.nextRunId = 1
    saveDb()
    logger.info('Initialized empty user db (4 account limit)')
  }
  return db
}

export function saveDb() {
  ensureDir()
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2))
}

loadDb()

// --- User ops (postgres abstracted away) ---

export function getUserById(userId: UserID): UserRecord | undefined {
  return db.users.find(u => u.user_id === userId)
}

export function getUserByAccountId(accountId: string): UserRecord | undefined {
  // for demo we treat accountId as the user_id for fixed ones
  return getUserById(accountId)
}

export function createUser(accountId?: string): UserID {
  let userId = accountId || ('u-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8))
  if (getUserById(userId)) {
    // already exists
    return userId
  }
  if (db.users.length >= MAX_ACCOUNTS) {
    // enforce hard limit - should not reach here from account mgmt UI
    logger.warn('Account limit reached, not creating new')
    // fallback: return a random existing? or throw. for safety return first user id if any, else the would-be id
    return db.users[0] ? db.users[0].user_id : userId
  }
  const rec: UserRecord = {
    user_id: userId,
    username: null,
    initial_auth_method: 'pick',
    discovered: { cards: [], souvenirs: [], swords: [] },
  }
  db.users.push(rec)
  saveDb()
  logger.info(`Created user ${userId}`)
  return userId
}

export function listAccounts(): Array<{ userId: UserID; username: string | null }> {
  return db.users.map(u => ({ userId: u.user_id, username: u.username }))
}

export function createAccount(username: string, overwrite = false): { success: boolean; userId?: UserID; username?: string; error?: string } {
  const trimmed = (username || '').trim()
  if (trimmed.length < 3 || trimmed.length > 20) {
    return { success: false, error: 'Username must be 3-20 characters' }
  }
  // basic sanitize
  const clean = trimmed.toLowerCase().replace(/[^a-z0-9_-]/g, '')
  if (!clean || clean.length < 3) {
    return { success: false, error: 'Invalid username. Use letters, numbers, _ or -' }
  }
  const existing = db.users.find(u => u.username && u.username.toLowerCase() === clean)
  if (existing) {
    if (!overwrite) {
      return { success: false, error: 'Username already taken. Choose another or delete/overwrite the existing account.' }
    }
    // overwrite: delete the existing account record (and its runs) to reuse the slot
    deleteAccount(existing.user_id)
    logger.info(`Overwriting account for username ${clean} (deleted old ${existing.user_id})`)
  }
  if (db.users.length >= MAX_ACCOUNTS) {
    return { success: false, error: 'Account limit reached (4 max). Delete one to add.' }
  }
  const userId = 'u-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
  const rec: UserRecord = {
    user_id: userId,
    username: clean,
    initial_auth_method: 'typed',
    discovered: { cards: [], souvenirs: [], swords: [] },
  }
  db.users.push(rec)
  saveDb()
  logger.info(`Created account ${userId} with username ${clean}`)
  return { success: true, userId, username: clean }
}

export function deleteAccount(userId: UserID): boolean {
  const before = db.users.length
  db.users = db.users.filter(u => u.user_id !== userId)
  // also remove their runs
  db.runs = db.runs.filter(r => r.user_id !== userId)
  if (db.users.length < before) {
    saveDb()
    logger.info(`Deleted account ${userId}`)
    return true
  }
  return false
}

export function updateUsername(userId: UserID, username: string): boolean {
  const u = getUserById(userId)
  if (!u) return false
  u.username = username.toLowerCase()
  saveDb()
  return true
}

export function usernameExists(username: string): boolean {
  const lower = username.toLowerCase()
  return db.users.some(u => u.username && u.username.toLowerCase() === lower)
}

export function touchLogin(userId: UserID) {
  const u = getUserById(userId)
  if (u) {
    u.last_login_ts = Date.now()
    saveDb()
  }
}

// --- Run ops for leaderboards etc ---

export function getCurrentRunId(userId: UserID): number | null {
  const active = db.runs
    .filter(r => r.user_id === userId && (r.run_status === 'initializing' || r.run_status === 'in_progress'))
    .sort((a,b) => b.run_id - a.run_id)[0]
  return active ? active.run_id : null
}

export function createRun(userId: UserID, gameState?: any): RunID {
  // abandon previous
  db.runs.forEach(r => {
    if (r.user_id === userId && (r.run_status === 'initializing' || r.run_status === 'in_progress')) {
      r.run_status = 'abandoned'
    }
  })

  const runId = db.nextRunId++
  const runStatus = gameState ? 'in_progress' : 'initializing'
  const rec: RunRecord = {
    run_id: runId,
    user_id: userId,
    run_status: runStatus,
    build_version: BUILD_VER || 'dev',
    start_ts: Date.now(),
    game_state: gameState || null,
  }
  db.runs.push(rec)
  saveDb()
  return runId
}

export function endRun(runId: RunID, status: string, score?: number, durationSec?: number, gameState?: any) {
  const run = db.runs.find(r => r.run_id === runId)
  if (!run) return
  run.run_status = (status === 'won' || status === 'lost') ? (status as any) : 'abandoned'
  run.end_ts = Date.now()
  if (durationSec != null) run.run_duration_in_sec = durationSec
  if (score != null) run.run_score = score
  if (gameState) run.game_state = gameState
  saveDb()
}

export function getAllRunsForLeaderboard() {
  // return raw for in-memory processing similar to sql
  return db.runs
}

export function getUsersMap() {
  const m: Record<UserID, UserRecord> = {}
  db.users.forEach(u => { m[u.user_id] = u })
  return m
}

export function countUsersWithUsername(name: string) {
  return usernameExists(name) ? 1 : 0
}

// --- Compendium (cards, souvenirs, swords/equippables) ---
export function getCompendium(userId: UserID) {
  const u = getUserById(userId)
  return u?.discovered || { cards: [], souvenirs: [], swords: [] }
}

export function discoverItem(userId: UserID, category: 'cards' | 'souvenirs' | 'swords', id: string) {
  const u = getUserById(userId)
  if (!u) return
  if (!u.discovered) u.discovered = { cards: [], souvenirs: [], swords: [] }
  const list = (u.discovered as any)[category]
  if (Array.isArray(list) && !list.includes(id)) {
    list.push(id)
    saveDb()
    logger.info(`Discovered ${category} ${id} for ${userId}`)
  }
}
