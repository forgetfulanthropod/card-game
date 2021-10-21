import { onCallWrapper } from '../util/onCallWrapper'


import { changeDungeon as changeDungeon_ } from '../gameState/entry/actions'

export default onCallWrapper(function changeDungeon(args: { direction: -1 | 1 }) { changeDungeon_(args) })
