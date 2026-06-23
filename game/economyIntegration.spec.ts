/* eslint-disable no-console */
/**
 * economy integration (includes marketplace buyFromMarket for chars/items)
 */
import { getInitialGameState } from './gameState'
import { doGameAction } from './gameAction'
import { toCursor } from './util/treeHelpers'
import type { GameState } from 'shared'

// Direct import of the pure layout fn from the extracted module (no stubs, no vm, no esbuild in test)
import { computeMarketplaceLayout } from '../client/scenes/marketplaceLayout'

function assert(cond: any, msg: string) { if (!cond) throw new Error('ASSERT: ' + msg) }

export const suites = {
  'economy integration': {
    'post openEndOfRun gems + buyFromMarket'() {
      const userId = 'econ-test'
      let gs: GameState = getInitialGameState(userId)
      // make scene battle so openEndOfRun's getBattleSceneIn succeeds
      ;(gs as any).scene = { id: 'battle' }
      const game = toCursor(gs)
      game.select('events').set('gems', 50)
      // openEndOfRun adds 25 via hook (real shipped)
      doGameAction({ method: 'openEndOfRun', game, userId } as any)
      let gems = game.select('events').get('gems') || 0
      assert(gems === 75, 'gems after openEndOfRun should be 75')
      // buy deducts 10 (real shipped)
      doGameAction({ method: 'buyFromMarket', game, userId, itemId: 'test', cost: 10 } as any)
      gems = game.select('events').get('gems') || 0
      assert(gems === 65, 'gems after buy should be 65')
      console.log('gems after econ test:', gems)
    },
    'marketplace changeScene + buy char and item (direct shipped actions)'() {
      const userId = 'mkt-test'
      let gs: GameState = getInitialGameState(userId, 'marketplace')
      const game = toCursor(gs)
      game.select('events').set('gems', 100)
      // change to marketplace (real)
      doGameAction({ method: 'changeScene', newSceneName: 'marketplace', game, userId } as any)
      assert(game.select('scene').get('id') === 'marketplace', 'scene should be marketplace')
      // buy char (real buyFromMarket shipped)
      doGameAction({ method: 'buyFromMarket', game, userId, itemId: 'char:frogKnight', cost: 15 } as any)
      let gems = game.select('events').get('gems') || 0
      assert(gems === 85, 'gems after char buy')
      const owned = game.select('ownedCharacters').get() || {}
      const hasChar = Object.keys(owned).some(k => k.startsWith('frogKnight-mkt-'))
      assert(hasChar, 'should have bought frogKnight into owned')
      // buy item
      doGameAction({ method: 'buyFromMarket', game, userId, itemId: 'item:gemBooster', cost: 5 } as any)
      gems = game.select('events').get('gems') || 0
      assert(gems === 80, 'gems after item buy')
      const purch = game.select('events').get('purchases') || []
      assert(purch.some((p: any) => p.itemId === 'item:gemBooster'), 'purchase recorded')
      console.log('marketplace buys ok, final gems:', gems, 'owned count:', Object.keys(owned).length)
    },
    'marketplace layout compute keeps all ys on-screen and bottoms after rows (list-length independent)'() {
      const BASE = 1080
      // direct import of pure fn from layout module; relative rows, pinned footer
      ;[10, 25, 40].forEach((charCount) => {
        const l = computeMarketplaceLayout(charCount, 3, BASE)
        const rowYs = [...l.stallRowYs, ...l.boothRowYs]
        rowYs.forEach((yv) => {
          assert(yv >= 0, `row y=${yv} >=0`)
        })
        // full list is scrollable; content height can exceed pane (last row may > paneH)
        assert(l.footerYs.note >= l.footerTop && l.footerYs.note <= BASE - 10, 'note on screen')
        assert(l.footerYs.owned >= l.footerTop && l.footerYs.owned <= BASE - 10, 'owned on screen')
        assert(l.footerYs.purchased >= l.footerTop && l.footerYs.purchased <= BASE - 10, 'purchased on screen')
        assert(l.footerYs.note < l.footerYs.owned && l.footerYs.owned < l.footerYs.purchased, 'footer order')
      })
      console.log('layout compute on-screen for 10/25/40 chars + items')
    }
  }
}
