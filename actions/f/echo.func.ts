import { onCallWrapper } from '../util/onCallWrapper'
export default onCallWrapper(function echo<T extends { [x: string]: never }>(args: T): T { return args })
