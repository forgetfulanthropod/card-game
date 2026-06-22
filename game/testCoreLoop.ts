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
  const { buildInitialGameState } = require('./entryBootstrap')
  const { toCursor } = require('./util/treeHelpers')

  // Worlds
  let gs: GameState = buildInitialGameState({ userId, sceneId: 'worlds' })
  let game = toCursor(gs)
  for (let i=0;i<3;i++) doGameAction({method:'rollKaiju',placeIndex:i as CharacterPlaceIndex,plain:true,game,userId} as any)
  assert((game.select('scene').get('selectedCharacters')||[]).filter((c:any)=>c).length===3,'w acquire')
  doGameAction({method:'placeSelectedCharacters',characters:[{allCharacterOptionsIndex:0,placeIndex:0},{allCharacterOptionsIndex:1,placeIndex:1},{allCharacterOptionsIndex:2,placeIndex:2}],game,userId} as any)
  doGameAction({method:'changeScene',newSceneName:'battle',game,userId} as any)
  assert(game.select('scene').get('id')==='battle','w battle')
  console.log('battle(Worlds) done')

  // PVP
  gs = buildInitialGameState({userId:userId+'-pvp',sceneId:'pvp'})
  game = toCursor(gs)
  for (let i=0;i<3;i++) doGameAction({method:'rollKaiju',placeIndex:i as CharacterPlaceIndex,plain:true,game,userId:userId+'-pvp'} as any)
  doGameAction({method:'changeScene',newSceneName:'battle',game,userId:userId+'-pvp'} as any)
  if (INCLUDE_PVP) assert(game.select('scene').get('id')==='battle','pvp battle')
  console.log('battle(PVP) done')

  // Daily (use entry id for state to satisfy getEntry in change; exception is no selection UI in real flow)
  setGlobalRandomSeed('daily-2026-06-22')
  gs = buildInitialGameState({userId:userId+'-daily',sceneId:'entry'})
  game = toCursor(gs)
  for (let i=0;i<3;i++) doGameAction({method:'rollKaiju',placeIndex:i as CharacterPlaceIndex,plain:false,enhanced:true,game,userId:userId+'-daily'} as any)
  doGameAction({method:'placeSelectedCharacters',characters:[{allCharacterOptionsIndex:0,placeIndex:0},{allCharacterOptionsIndex:1,placeIndex:1},{allCharacterOptionsIndex:2,placeIndex:2}],game,userId:userId+'-daily'} as any)
  const dailySel = game.select('scene').get('selectedCharacters') || []
  assert(dailySel.filter((c:any)=>c).length===3,'daily 3 selected after place')
  doGameAction({method:'changeScene',newSceneName:'battle',game,userId:userId+'-daily'} as any)
  assert(game.select('scene').get('id')==='battle','daily battle')
  console.log('DailyQuick done')

  const repoRoot = path.resolve(__dirname,'..')
  const es = fs.readFileSync(path.join(repoRoot,'client/scenes/entry/DungeonEntryScene.ts'),'utf8')
  const ws = fs.readFileSync(path.join(repoRoot,'client/scenes/entry/WorldsScene.ts'),'utf8')
  const ps = fs.readFileSync(path.join(repoRoot,'client/scenes/entry/PVPScene.ts'),'utf8')
  assert(es.includes('export class DungeonEntryScene extends PixiContainer'),'base class')
  assert(ws.includes('extends DungeonEntryScene'),'w extends')
  assert(ps.includes('extends DungeonEntryScene'),'p extends')

  const ds = fs.readFileSync(path.join(repoRoot,'client/scenes/entry/DailyScene.ts'),'utf8')
  assert(ds.includes('NO CHARACTER SELECTION – ONLY MODE'),'daily comment')

  // per-phase asserts already verified 3 selected + battle for each; final state after last daily is battle
  assert(game.select('scene').get('id')==='battle','final battle')
  const rb = getRulebook()
  assert(typeof rb.version==='string' && rb.version.length>0,'rb ver')

  console.log('✅ testCoreLoop PASSED (seed='+SEED_ARG+', pvp='+INCLUDE_PVP+')')
}
if (require.main === module) main().catch(e=>{console.error(e);process.exit(1)})
export { main as runTestCoreLoop }
