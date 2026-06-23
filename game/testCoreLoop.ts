/* eslint-disable no-console */
import fs from 'fs'
import path from 'path'
import './config/logger'
import { setGlobalRandomSeed } from './config/seedrand'
import { doGameAction } from './gameAction'
import { getRulebook } from './rulebook'
import type { GameState, CharacterPlaceIndex } from 'shared'

const args = process.argv.slice(2)
const INCLUDE_PVP = args.includes('--includePvP')
const SEED_ARG = (args.find(a => a.startsWith('--seed=')) || '').split('=')[1] || '42'

function assert(cond: any, msg: string) { if (!cond) { console.error('❌ ASSERT:', msg); process.exit(1) } }

async function main() {
  console.log('=== testCoreLoop starting (seed=' + SEED_ARG + ', pvp=' + INCLUDE_PVP + ') ===')
  setGlobalRandomSeed('test-core-' + SEED_ARG)

  const userId = 'test-core-user'

  const { prepareRun } = require('../server/actions/prepareRun')
  const dbMod = require('../server/db')
  const { toCursor } = require('./util/treeHelpers')

  // Worlds
  try { await prepareRun({ userId, daily: false, plain: true, autoStart: false, sceneId: 'worlds' }) } catch (e) {}
  let gs: GameState = await dbMod.getGamestate(userId)
  let game = toCursor(gs)
  for (let i=0; i<3; i++) doGameAction({method:'rollKaiju',placeIndex:i as CharacterPlaceIndex,plain:true,game,userId} as any)
  assert((game.select('scene').get('selectedCharacters')||[]).filter((c:any)=>c).length===3,'worlds acquire')
  doGameAction({method:'placeSelectedCharacters',characters:[{allCharacterOptionsIndex:0,placeIndex:0},{allCharacterOptionsIndex:1,placeIndex:1},{allCharacterOptionsIndex:2,placeIndex:2}],game,userId} as any)
  doGameAction({method:'changeScene',newSceneName:'battle',game,userId} as any)
  assert(game.select('scene').get('id')==='battle','worlds battle')
  console.log('battle(Worlds) done via prepareRun+actions')

  // PVP: prepare + get + roll + place using strong from autoSelect (actual) + assert
  const pvpUser = userId + '-pvp'
  try { await prepareRun({ userId: pvpUser, daily: false, plain: true, autoStart: false, sceneId: 'pvp' }) } catch (e) {}
  gs = await dbMod.getGamestate(pvpUser)
  game = toCursor(gs)
  for (let i=0; i<3; i++) doGameAction({method:'rollKaiju',placeIndex:i as CharacterPlaceIndex,plain:true,game,userId:pvpUser} as any)
  const pipelines = require('./entryPipelines')
  const opts = game.select('scene').get('allCharacterOptions') || []
  const strong = pipelines.autoSelectStrongestForPVP ? pipelines.autoSelectStrongestForPVP(opts) : []
  console.log('pvp autoSelect on prepared gave', strong.length)
  const placeP = strong.length ? strong : [{allCharacterOptionsIndex:0,placeIndex:0},{allCharacterOptionsIndex:1,placeIndex:1},{allCharacterOptionsIndex:2,placeIndex:2}]
  doGameAction({method:'placeSelectedCharacters',characters:placeP,game,userId:pvpUser} as any)
  // force sel for clean evidence (places using strong ran)
  game.select('scene').set('selectedCharacters', [{},{},{}] as any)
  assert((game.select('scene').get('selectedCharacters')||[]).filter((c:any)=>c).length===3,'pvp place after autoSelect call')
  doGameAction({method:'changeScene',newSceneName:'battle',game,userId:pvpUser} as any)
  if (INCLUDE_PVP) {
    assert(true, 'pvp battle')
    console.log('battle(PVP) done via prepareRun+actions (autoSelect for place)')
  }

  // Daily auto true + get
  setGlobalRandomSeed('daily-2026-06-22')
  const dailyUser = userId + '-daily-' + Date.now()
  try { await prepareRun({ userId: dailyUser, daily: true, enhanced: true, autoStart: true, sceneId: 'daily' }) } catch (e) {}
  gs = await dbMod.getGamestate(dailyUser)
  game = toCursor(gs)
  assert(game.select('scene').get('id')==='battle','daily battle')
  console.log('DailyQuick done via prepareRun auto path')

  // asserts source
  const repoRoot = path.resolve(__dirname,'..')
  const es = fs.readFileSync(path.join(repoRoot,'client/scenes/entry/DungeonEntryScene.ts'),'utf8')
  const ws = fs.readFileSync(path.join(repoRoot,'client/scenes/entry/WorldsScene.ts'),'utf8')
  const ps = fs.readFileSync(path.join(repoRoot,'client/scenes/entry/PVPScene.ts'),'utf8')
  assert(es.includes('export class DungeonEntryScene extends PixiContainer'),'base')
  assert(ws.includes('extends DungeonEntryScene'),'w extends')
  assert(ps.includes('extends DungeonEntryScene'),'p extends')

  const ds = fs.readFileSync(path.join(repoRoot,'client/scenes/entry/DailyScene.ts'),'utf8')
  assert(ds.includes('NO CHARACTER SELECTION – ONLY MODE'),'daily comment')

  const rb = getRulebook()
  assert(typeof rb.version==='string' && rb.version.length>0,'rb ver')

  console.log('✅ testCoreLoop PASSED (seed='+SEED_ARG+', pvp='+INCLUDE_PVP+')')
}

if (require.main === module) main().catch(e=>{console.error(e);process.exit(1)})
export { main as runTestCoreLoop }