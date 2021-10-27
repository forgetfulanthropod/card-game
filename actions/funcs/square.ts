import { onCallWrapper } from '@/util'

export default onCallWrapper(function square(args: { n?: string }): number {
    if (args.n == null) { throw Error('n is null') }
    return Number(args.n) ** 2
})
