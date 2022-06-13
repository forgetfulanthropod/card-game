/* eslint-disable import/no-internal-modules */
// import type { GameActions } from '@serverActions'
// import { satisfies } from 'shared/code'
import './config/logger'
import './config/seedrand'

import * as actions from './actions'
export { setGlobalRandomSeed } from './config/seedrand'
// TODO: below will work once we lowercase GameActions
// import { satisfies } from 'shared/code'
// import type { GameActions } from './actions/types'
// satisfies<GameActions>(actions)

export { clearHappened, getHappened } from './util'

// satisfies<GameActions>(actions)
export { actions }
export { getInitialGameState } from './gameState'

export { step } from './actions'
export { getLogger } from './config/logger'
