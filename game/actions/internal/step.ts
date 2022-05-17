import type { SCursor } from 'sbaobab'
import type {
    Gamestate,
    InternalAction,
    InternalActionName,
    NextAction,
} from 'shared'

import { doNpcTurn } from './doNpcTurn'
import { resetRound } from './resetRound'

const internalActions: InternalAction = { doNpcTurn, resetRound } as const

// type ArgsOf = {
//     [K in ActionName]: Param1<InternalAction[K]>
// }

export function step<K extends InternalActionName>(
    game: SCursor<Gamestate>,
    action: NextAction<K>
): ReturnType<InternalAction[K]> {
    const func = internalActions[action.type]
    const res = func(
        game,
        // @ts-expect-error
        action.args
    )
    // @ts-expect-error
    return res
}
