import type { GameActions } from '@serverActions'

export const hello: GameActions['Hello'] = () => {
    // console.log(args.username)
    return 'hello'
}
