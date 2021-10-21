import { onCallWrapper } from '../util/onCallWrapper'

export default onCallWrapper((args: { n: string }): number => { return Number(args.n) ** 2 })
