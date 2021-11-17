import type { Hello } from '@serverActions'

export const hello: Hello = (args) => {
    console.log(args.username)
    return args.username
}
