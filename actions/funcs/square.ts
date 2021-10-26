import { onCallWrapper } from '@/util'

export default onCallWrapper(function square(args: { n: string }): number { return Number(args.n) ** 2 })
