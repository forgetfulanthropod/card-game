import { onCallWrapper } from '../util/onCallWrapper'
export default onCallWrapper(<T extends { [x: string]: never }>(args: T): T => { return args })
