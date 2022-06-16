/* eslint-disable import/no-internal-modules */
// import type { GameActions } from '@serverActions'
// import { satisfies } from 'shared/code'
import './config/logger'
import './config/seedrand'

export { setGlobalRandomSeed } from './config/seedrand'

export { clearHappened, getHappened } from './util'

export { getInitialGameState } from './gameState'

export { step } from './actions'
export { getLogger } from './config/logger'

export { doGameAction, isGameAction } from './gameAction'
