/**
 * Action script that plays POORLY and dies quickly.
 * Used for testing. Simulates bad plays.
 * Discovers items into the compendium (via direct DB edit for test isolation).
 * Run: bash run test:poor [userId]
 */
import * as fs from 'fs'
import * as path from 'path'

const DB_PATH = path.join(process.cwd(), 'server', 'data', 'simple-db.json')
const userId = process.argv[2] || 'test-poor-player'

function loadDb() {
  try { return JSON.parse(fs.readFileSync(DB_PATH, 'utf8')) } catch { return { users: [], runs: [], nextRunId: 1 } }
}
function saveDb(db: any) { fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2)) }

function ensureUser(db: any) {
  let u = db.users.find((x: any) => x.user_id === userId)
  if (!u) {
    u = { user_id: userId, username: userId, discovered: { cards: [], souvenirs: [], swords: [] } }
    db.users.push(u)
  }
  if (!u.discovered) u.discovered = { cards: [], souvenirs: [], swords: [] }
  return u
}

function discover(u: any, cat: 'cards'|'souvenirs'|'swords', id: string) {
  if (!u.discovered[cat].includes(id)) u.discovered[cat].push(id)
}

const ALL_CARDS = ['leadRazor', 'shieldOfHolyLight', 'attack', 'magicAttack', 'chainLightning', 'shield']
const ALL_SOUVS = ['bigStinkyTooth', 'dentistryForDummies', 'frogWine']
const ALL_SWORDS = ['normal', 'dirt', 'wood', 'iron', 'jade', 'fire', 'great']

async function main() {
  console.log('=== POOR PLAY BOT (quick death for testing) ===')
  console.log('Targeting user/account:', userId)

  const db = loadDb()
  const u = ensureUser(db)

  // "play poorly" 4 turns -> die
  for (let t = 1; t <= 4; t++) {
    const c = ALL_CARDS[Math.floor(Math.random() * ALL_CARDS.length)]
    console.log(`[turn ${t}] Bad play: ${c} (missed energy, wrong target)`)
    discover(u, 'cards', c)

    if (Math.random() > 0.5) {
      const s = ALL_SOUVS[Math.floor(Math.random() * ALL_SOUVS.length)]
      console.log(`   + bad souvenir ${s}`)
      discover(u, 'souvenirs', s)
    }
    if (Math.random() > 0.7) {
      const sw = ALL_SWORDS[Math.floor(Math.random() * ALL_SWORDS.length)]
      console.log(`   + bad sword part ${sw}`)
      discover(u, 'swords', sw)
    }
    if (t === 4) {
      console.log('FATAL: died from awful decisions.')
    }
  }

  saveDb(db)
  const c = u.discovered
  console.log('\n=== COMPENDIUM (gray = undiscovered in UI) ===')
  console.log('Cards:', c.cards)
  console.log('Souvenirs:', c.souvenirs)
  console.log('Swords:', c.swords)
  console.log('Now open a saved game menu -> Compendium to see (grayed items)')
}

main()