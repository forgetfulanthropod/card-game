
import { getRootCursor } from '@/util'

import type { IncrementTestCounter } from '@shared'
export const incrementTestCounter: IncrementTestCounter = (args) => {
    const doc = getRootCursor().select('testCounters').select('counter0')
    doc.apply(x => x + 1)
    doc.commit('counterChange', true)
}
