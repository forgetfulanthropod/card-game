import type { GameActionCall, GameActions } from 'shared'
import { satisfies, throwNull } from 'shared/code'
import * as actions from './actions'
satisfies<GameActions>(actions)
export function doGameAction(args: GameActionCall) {
    const method = args.method
    const action = actions[method] ?? throwNull(`actions.${method}`)
    // @ts-expect-error
    action(args)
}

export function isGameAction(name: string): name is keyof GameActions {
    return name in actions
}
