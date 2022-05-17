/**
 * Next step in morning?
 * Reduce coupling further?
 */
import type { GameActions } from '@serverActions'

import * as GameActionFunctions from './actions'
const _ = GameActionFunctions
type GameCommand<K extends keyof GameActions> = {
    name: K
    args: Parameters<GameActions[K]>[0]
}
export function step<K extends keyof GameActions>(_cmd: GameCommand<K>) {}
