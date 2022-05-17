import type { ServerActions } from '@serverActions'

export const hello: ServerActions['Hello'] = () => {
    // console.log(args.username)
    return 'hello'
}
