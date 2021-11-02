import type { SetBlessings } from '@shared'

import { getGameStateCursor } from '@/util'

export const setBlessings: SetBlessings = (args) => {
    getGameStateCursor('alice').set('blessings', args.blessings)
}
