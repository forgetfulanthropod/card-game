import { onCallWrapper } from '../util/onCallWrapper'

export default onCallWrapper(function square(args: { n: string }): number { return Number(args.n) ** 2 })
