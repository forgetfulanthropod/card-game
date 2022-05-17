import type { SCursor } from 'sbaobab'

import type { Gamestate } from '@/../shared'

import { doNpcTurn } from './doNpcTurn'
import { resetRound } from './resetRound'

const internalActions = { doNpcTurn, resetRound } as const

type InternalAction = typeof internalActions
type ActionName = keyof InternalAction
// type InternalActions = (typeof internalActions)[ActionName]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Param1<T extends (...args: any[]) => any> = Parameters<T>[1]

export type NextAction<K extends ActionName = ActionName> = {
    type: K
    delay: number
    args: Param1<InternalAction[K]>
}

type ArgsOf = {
    [K in ActionName]: Param1<InternalAction[K]>
}

export function step<K extends ActionName>(
    game: SCursor<Gamestate>,
    action: NextAction<K>
): ReturnType<InternalAction[K]> {
    const func = internalActions[action.type]
    const args = action.args
    const res = func(
        game,
        // @ts-expect-error
        action.args
    )
    // @ts-expect-error
    return res
}
