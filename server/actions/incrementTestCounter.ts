
import type { IncrementTestCounter } from '@shared'

import { getRootCursor } from '@/util'
export const incrementTestCounter: IncrementTestCounter = (_args) => {
    const doc = getRootCursor().select('testCounters').select('counter0')
    doc.apply(x => x + 1)
    doc.commit('counterChange', true)
}
