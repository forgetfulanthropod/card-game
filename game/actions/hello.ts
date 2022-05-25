import type { GameActions } from './types'

export const hello: GameActions['Hello'] = () => {
    // console.log(args.username)
    return 'hello'
}
