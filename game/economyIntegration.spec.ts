/* eslint-disable no-console */
import { getInitialGameState } from './gameState'
import { doGameAction } from './gameAction'
import { toCursor } from './util/treeHelpers'
import type { GameState } from 'shared'

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
    }
  }
}
