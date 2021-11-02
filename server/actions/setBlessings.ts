import type { SetBlessings } from '@shared'

import { blessingsMap } from '@/rulebook/blessingsMap'
import { getGameStateCursor } from '@/util'

export const setBlessings: SetBlessings = (args) => {
    getGameStateCursor('alice').set('blessings', args.blessings.map(b => blessingsMap[b]))
}
