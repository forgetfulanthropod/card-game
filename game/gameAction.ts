import type { BattleCursor, GameActionCall, GameActions } from 'shared'
import { satisfies, throwNull } from 'shared/code'
import * as actions from './actions'
satisfies<GameActions>(actions)
export function doGameAction(args: GameActionCall) {
    const { game, method } = args
    if (
        game.get('scene', 'name') === 'battle' &&
        (game.select('scene') as BattleCursor).get('requireAction') != null &&
        method !== 'finishCard'
    ) {
        throw Error('you must finish your card before doing another action')
    }
    const action = actions[method] ?? throwNull(`actions.${method}`)
    // @ts-expect-error
    action(args)
}

export function isGameAction(name: string): name is keyof GameActions {
    return name in actions
}
