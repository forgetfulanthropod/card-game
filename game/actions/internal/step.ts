import type { InternalActions, NextAction } from 'shared'
import { activatePlayCardHooks } from './activatePlayCardHooks'

import { doNpcTurn } from './doNpcTurn'
import { endNpcTurn } from './endNpcTurn'

const internalActions: InternalActions = {
    activatePlayCardHooks,
    doNpcTurn,
    endNpcTurn,
} as const

export function step(game: Gamecursor, action: NextAction) {
    const func = internalActions[action.method]
    // @ts-expect-error
    func({ game, ...action })
}
